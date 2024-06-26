# syntax = docker/dockerfile:1.2

ARG KEYCLOAK_VERSION

# build a custom extensions for keycloak using maven
FROM maven:3-eclipse-temurin-21 AS builder

ARG KEYCLOAK_VERSION
WORKDIR /build
COPY ./src /build/src
COPY ./pom.xml /build
RUN --mount=type=cache,target=/root/.m2 set -x && \
    export SKIP_INTEGRATION_TESTS=true && \
    mvn -B package -Drevision=${KEYCLOAK_VERSION}

# TODO: Use a builder image for faster startup. e.g. https://www.keycloak.org/server/containers
ARG KEYCLOAK_VERSION
FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION}

USER root

# get the compiled extensions
COPY --from=builder --chown=keycloak:keycloak /build/target/keycloak-extensions-*-jar-with-dependencies.jar /opt/keycloak/providers/

# TODO: standalone import in Keycloak doesn't interpolate environment variables so have to build this outside
# Ideally ProductOwner would register itself as a client on first startup and store the secret in some kind of vault
# The import itself is run during the startup script
COPY --chown=keycloak:keycloak target/open-products-facts-realm.json /opt/keycloak/data/import/open-products-facts-realm.json
COPY --chown=keycloak:keycloak runtime-scripts/* /opt/keycloak

RUN chown -R keycloak:root /opt/keycloak

# Copy in the themes. Comment this out to use the volume mapping in docker-compose.yml
COPY --chown=keycloak:keycloak theme/off /opt/keycloak/themes/off

USER keycloak

ENTRYPOINT [ "sh", "/opt/keycloak/startup.sh" ]

