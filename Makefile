include .env
export

SHELL := /bin/bash

build:
	node build-scripts/build_languages.mjs
	mkdir -p target
	set -o allexport; source .env; set +o allexport; envsubst \$$PRODUCT_OPENER_OIDC_CLIENT_ID,\$$PRODUCT_OPENER_DOMAIN,\$$PRODUCT_OPENER_OIDC_CLIENT_SECRET,\$$REDIS_URL < conf/open-products-facts-realm.json > target/open-products-facts-realm.json
	docker compose up -d --build

up:
	docker compose up -d

down:
	docker compose down --remove-orphans

dev: run_deps build up

refresh_themes:
	wget https://github.com/keycloak/keycloak/releases/download/${KEYCLOAK_VERSION}/keycloak-${KEYCLOAK_VERSION}.tar.gz
	tar -xzvf keycloak-${KEYCLOAK_VERSION}.tar.gz keycloak-${KEYCLOAK_VERSION}/lib/lib/main/org.keycloak.keycloak-themes-${KEYCLOAK_VERSION}.jar --strip-components=4
	rm -rf theme/base
	rm -rf theme/keycloak
	rm -rf theme/keycloak.v2
	jar xf org.keycloak.keycloak-themes-${KEYCLOAK_VERSION}.jar theme
	rm keycloak-${KEYCLOAK_VERSION}.tar.gz
	rm org.keycloak.keycloak-themes-${KEYCLOAK_VERSION}.jar
	node build-scripts/refresh_messages.mjs

run: run_deps
# Don't include dev.yml in "run" mode so we use the pre-built image
# Change the KEYCLOAK_TAG value to "dev" to use the dev image on run
	COMPOSE_FILE=docker-compose.yml,docker-compose-run.yml docker compose up -d

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
