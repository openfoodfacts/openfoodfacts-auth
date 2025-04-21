include .env
-include .envrc

export

SHELL := $(shell which bash)
# Docker command to use when running as a dependency (shallow clone)
DOCKER_RUN=COMPOSE_FILE=${COMPOSE_FILE_RUN} docker

# Initialises Playwright for tests. Note this requires sudo access
# Not currently using webkit as it fails intermittently
init:
	npm ci
	npx playwright install --with-deps chromium firefox

install:
	mvn clean install

build_languages:
	node build-scripts/build_languages.mjs

build: build_languages
# Generate a unique id for the build
	cp -rf /proc/sys/kernel/random/uuid runtime-scripts/image_id
	docker compose build

dev: init run_deps build

# Need a long wait timeout in case full migrations are running
up: run_deps create_user
	docker compose up --wait --wait-timeout 120

# Minimal container used by other projects for integration tests. Make target here is just to test it can start
integration_test_target:
	COMPOSE_FILE=docker-compose.yml KEYCLOAK_STARTUP=test KEYCLOAK_TAG=dev docker compose up --wait --wait-timeout 120

show_keycloak_logs:
	docker compose logs keycloak

down:
	docker compose down --remove-orphans

hdown:
	docker compose down -v --remove-orphans

prune:
	docker system prune -af

create_externals:
	docker volume create ${COMPOSE_PROJECT_NAME}_pgdata

remove_externals:
	docker volume rm ${COMPOSE_PROJECT_NAME}_pgdata

test: test_setup
	npx playwright test ${args}

# Update expected screen shots. Need to be able to run this from CI in order to get a consistent environment
update_screenshots: test_setup
	npx playwright test --update-snapshots screenshots.spec.ts

# Currently using dev mode for tests as had issues using production mode in Github workflows
test_setup: up show_keycloak_logs
	node build-scripts/test_setup.mjs

# We keep a copy of the Keycloak themes in our own source control so that we can easily see diffs after keycloak upgrades.
# These themese aren't actually used in the deployment, they are just for reference
refresh_themes:
	rm -rf theme/base theme/keycloak theme/keycloak.v2 theme/keycloak.v3
	wget https://github.com/keycloak/keycloak/releases/download/${KEYCLOAK_VERSION}/keycloak-${KEYCLOAK_VERSION}.tar.gz

	tar -xzvf keycloak-${KEYCLOAK_VERSION}.tar.gz keycloak-${KEYCLOAK_VERSION}/lib/lib/main/org.keycloak.keycloak-themes-${KEYCLOAK_VERSION}.jar --strip-components=4
	jar xf org.keycloak.keycloak-themes-${KEYCLOAK_VERSION}.jar theme
	rm org.keycloak.keycloak-themes-${KEYCLOAK_VERSION}.jar

	tar -xzvf keycloak-${KEYCLOAK_VERSION}.tar.gz keycloak-${KEYCLOAK_VERSION}/lib/lib/main/org.keycloak.keycloak-account-ui-${KEYCLOAK_VERSION}.jar --strip-components=4
	jar xf org.keycloak.keycloak-account-ui-${KEYCLOAK_VERSION}.jar theme
	rm org.keycloak.keycloak-account-ui-${KEYCLOAK_VERSION}.jar

	rm keycloak-${KEYCLOAK_VERSION}.tar.gz

	$(MAKE) refresh_messages
	$(MAKE) update_keycloak_version

# Updates the Keycloak version in the pom.xml file as using ${env.KEYCLOAK_VERSION} can be tricky
# with IDE's like VSCode that load Maven before the .env file has been evaluated
update_keycloak_version:
	node build-scripts/update_keycloak_version.mjs

# This will find any existing Keycloak translations for messages defined in the messages_en file
# It also downloads the current languages and countries taxonomies from openfoodfacts-server and
# adds any new languages or countries to the keycloak configuration.
refresh_messages:
	node build-scripts/refresh_messages.mjs

# Creates the bootstrap user in PostgreSQL, which is then used to create other users
create_bootstrap: run_deps
	${DOCKER_RUN} compose up keycloak_postgres --wait
	@${DOCKER_RUN} compose exec -e PGUSER=${PG_ADMIN_USERNAME} -e PGPASSWORD=${PG_ADMIN_PASSWORD} keycloak_postgres \
	  psql -c "create role ${PG_BOOTSTRAP_USERNAME} with password '${PG_BOOTSTRAP_PASSWORD}' login createdb createrole" || true

create_user: create_bootstrap
	@${DOCKER_RUN} compose exec -e PGUSER=${PG_BOOTSTRAP_USERNAME} -e PGPASSWORD=${PG_BOOTSTRAP_PASSWORD} keycloak_postgres \
	  psql -d postgres -c "create role ${KC_DB_USERNAME} with password '${KC_DB_PASSWORD}' login createdb" || true
	@${DOCKER_RUN} compose exec -e PGUSER=${KC_DB_USERNAME} -e PGPASSWORD=${KC_DB_PASSWORD} keycloak_postgres \
	  psql -d postgres -c "create database ${KC_DB_USERNAME}" || true

# Create user / database in production PostgreSQL instance
create_user_prod:
	@docker run --rm --entrypoint bin/bash postgres:16-alpine \
	  -c "PGPASSWORD=${PG_BOOTSTRAP_PASSWORD} psql -h ${KC_DB_URL_HOST} -d postgres -U ${PG_BOOTSTRAP_USERNAME} -c \"create role ${KC_DB_USERNAME} with password '${KC_DB_PASSWORD}' login createdb\"; \
	  PGPASSWORD=${KC_DB_PASSWORD} psql -h ${KC_DB_URL_HOST} -d postgres -U ${KC_DB_USERNAME} -c \"create database ${KC_DB_USERNAME}\" || true "


# Called by other projects to start this project as a dependency
# Use docker compose pull to ensure we get the latest keycloak image (unless we are using the dev image)
run: create_user
	if [ "${KEYCLOAK_TAG}" != "dev" ]; then \
	    ${DOCKER_RUN} compose pull keycloak; fi && \
	if ! ${DOCKER_RUN} compose up --wait --wait-timeout 120; then \
		${DOCKER_RUN} compose logs && exit 1; fi

# Space delimited list of dependant projects
DEPS=openfoodfacts-shared-services
# Set the DEPS_DIR if it hasn't been set already
ifeq (${DEPS_DIR},)
	export DEPS_DIR=${PWD}/deps
endif

# Run dependent projects
run_deps: create_externals clone_deps
	@for dep in ${DEPS} ; do \
		cd ${DEPS_DIR}/$$dep && $(MAKE) run; \
	done

# Clone dependent projects without running them (used to pull in yml for tests)
clone_deps:
	@mkdir -p ${DEPS_DIR}; \
	for dep in ${DEPS} ; do \
		echo $$dep; \
		if [ ! -d ${DEPS_DIR}/$$dep ]; then \
			git clone --filter=blob:none --sparse \
				https://github.com/openfoodfacts/$$dep.git ${DEPS_DIR}/$$dep; \
		else \
			cd ${DEPS_DIR}/$$dep && git pull; \
		fi; \
	done
