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

# get the compiled extensions
COPY --from=builder --chown=keycloak:keycloak /build/target/keycloak-extensions-*-jar-with-dependencies.jar /opt/keycloak/providers/

# OFF theme
COPY --chown=keycloak:keycloak theme/off /opt/keycloak/themes/off

# Pre-optimize the build
RUN /opt/keycloak/bin/kc.sh build --db=postgres --health-enabled=true --metrics-enabled=true

FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION}

COPY --from=keycloak_builder /opt/keycloak/ /opt/keycloak/

# OFF specific configurations
COPY --chown=keycloak:keycloak runtime-scripts /etc/off
# Need to import the realm at startup as otherwise Github workflow tests fail
COPY --chown=keycloak:keycloak runtime-scripts/open-products-facts-realm.json /opt/keycloak/data/import/open-products-facts-realm.json

# Need quite a long grace period for startup because of running migrations
HEALTHCHECK --start-period=120s --interval=1s CMD timeout 1s bash -c 'test -f /tmp/health && :> /dev/tcp/localhost/8080'

ENTRYPOINT [ "sh", "/etc/off/startup.sh" ]
