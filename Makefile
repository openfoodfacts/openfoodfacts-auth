include .env

SHELL := /bin/bash

build:
	node build-scripts/build_languages.mjs
	set -o allexport; source .env; set +o allexport; envsubst \$$PRODUCT_OPENER_OIDC_CLIENT_ID,\$$PRODUCT_OPENER_DOMAIN,\$$PRODUCT_OPENER_OIDC_CLIENT_SECRET,\$$REDIS_URL < conf/open-products-facts-realm.json > target/open-products-facts-realm.json

up:
	docker compose up -d --build

dev: build up

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
