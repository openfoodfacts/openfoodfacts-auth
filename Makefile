SHELL := /bin/bash

build:
	node build-scripts/build_languages.mjs
	set -o allexport; source .env; set +o allexport; envsubst \$$PRODUCT_OPENER_OIDC_CLIENT_ID,\$$PRODUCT_OPENER_DOMAIN,\$$PRODUCT_OPENER_OIDC_CLIENT_SECRET,\$$REDIS_URL < conf/open-products-facts-realm.json > target/open-products-facts-realm.json

up:
	docker compose up -d --build

dev: build up
