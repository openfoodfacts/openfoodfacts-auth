include .env
-include .envrc

export

SHELL := $(shell which bash)

# Initialises Playwright for tests. Note this requires sudo access
# Not currently using webkit as it fails intermittently
init:
	npm ci
	npx playwright install --with-deps chromium firefox

install:
	mvn install

build_languages:
	node build-scripts/build_languages.mjs

build: build_languages
	docker compose build

dev: init run_deps build

# Need a long wait timeout in case full migrations are running
up: run_deps create_user
	docker compose up --wait --wait-timeout 120

# Minimal container used by other projects for integration tests. Make target here is just to test it can start
integration_test_target:
	COMPOSE_FILE=docker-compose.yml KEYCLOAK_STARTUP=test KEYCLOAK_TAG=dev docker compose up --wait --wait-timeout 120

down:
	docker compose down --remove-orphans

hdown:
	docker compose down -v --remove-orphans

create_externals:
	docker volume create ${COMPOSE_PROJECT_NAME}_pgdata

remove_externals:
	docker volume rm ${COMPOSE_PROJECT_NAME}_pgdata

test: test_setup
	npx playwright test

# Currently using dev mode for tests as had issues using production mode in Github workflows
test_setup: up
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

# This will find any existing Keycloak translations for messages defined in the messages_en file
# It also downloads the current languages and countries taxonomies from openfoodfacts-server and
# adds any new languages or countries to the keycloak configuration.
refresh_messages:
	node build-scripts/refresh_messages.mjs

# Creates the bootstrap user in PostgreSQL, which is then used to create other users
create_bootstrap: run_deps
	docker compose up keycloak_postgres --wait
	@docker run --rm --network ${COMMON_NET_NAME} --entrypoint bin/bash postgres:16-alpine \
	  -c "PGPASSWORD=${PG_ADMIN_PASSWORD} psql -h ${KC_DB_URL_HOST} -U ${PG_ADMIN_USERNAME} -c \"create role ${PG_BOOTSTRAP_USERNAME} with password '${PG_BOOTSTRAP_PASSWORD}' login createdb createrole\" || true "

create_user: create_bootstrap
	@docker run --rm --network ${COMMON_NET_NAME} --entrypoint bin/bash postgres:16-alpine \
	  -c "PGPASSWORD=${PG_BOOTSTRAP_PASSWORD} psql -h ${KC_DB_URL_HOST} -d postgres -U ${PG_BOOTSTRAP_USERNAME} -c \"create role ${KC_DB_USERNAME} with password '${KC_DB_PASSWORD}' login createdb\"; \
	  PGPASSWORD=${KC_DB_PASSWORD} psql -h ${KC_DB_URL_HOST} -d postgres -U ${KC_DB_USERNAME} -c \"create database ${KC_DB_USERNAME}\" || true "

# Called by other projects to start this project as a dependency
run: run_deps
	COMPOSE_FILE=${COMPOSE_FILE_RUN} docker compose up -d

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
