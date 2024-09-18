include .env
-include .envrc

export

SHELL := /bin/bash

# Initialises Playwright for tests. Note this requires sudo access
init:
	npm ci
	npx playwright install --with-deps

build_languages:
	node build-scripts/build_languages.mjs

build: build_languages
	mkdir -p target
	set -o allexport; source .env; set +o allexport; envsubst \$$PRODUCT_OPENER_OIDC_CLIENT_ID,\$$PRODUCT_OPENER_DOMAIN,\$$PRODUCT_OPENER_OIDC_CLIENT_SECRET,\$$REDIS_URL < conf/open-products-facts-realm.json > target/open-products-facts-realm.json
	docker compose build

dev: init run_deps build

up: run_deps
	docker compose up --pull=always --wait

down:
	docker compose down --remove-orphans

test:
	npx playwright test

# We keep a copy of the Keycloak themes in our own source control so that we can easily see diffs after keycloak upgrades.
# These themese aren't actually used in the deployment, they are just for reference
refresh_themes:
	rm -rf theme/base
	rm -rf theme/keycloak
	rm -rf theme/keycloak.v2
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
run_deps: clone_deps
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
