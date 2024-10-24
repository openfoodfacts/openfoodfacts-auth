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
FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION} as keycloak_builder

# Don't configure a database vendor here as for tests we want to use the dev-file option
# ENV KC_DB=postgres

#USER root

# get the compiled extensions
COPY --from=builder --chown=keycloak:keycloak /build/target/keycloak-extensions-*-jar-with-dependencies.jar /opt/keycloak/providers/

# TODO: standalone import in Keycloak doesn't interpolate environment variables so have to build this outside
# Ideally ProductOwner would register itself as a client on first startup and store the secret in some kind of vault
# The import itself is run during the startup script
COPY --chown=keycloak:keycloak target/open-products-facts-realm.json /opt/keycloak/data/import/open-products-facts-realm.json
COPY --chown=keycloak:keycloak runtime-scripts/* /etc/off

#RUN chown -R keycloak:root /opt/keycloak

# Copy in the themes. Comment this out to use the volume mapping in docker-compose.yml
COPY --chown=keycloak:keycloak theme/off /opt/keycloak/themes/off
#USER keycloak

RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION}

COPY --from=keycloak_builder /opt/keycloak/ /opt/keycloak/

HEALTHCHECK --start-period=60s --interval=1s CMD timeout 1s bash -c 'test -f /tmp/health && :> /dev/tcp/localhost/8080'

ENTRYPOINT [ "sh", "/etc/off/startup.sh" ]

