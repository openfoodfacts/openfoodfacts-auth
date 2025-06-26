# syntax = docker/dockerfile:1.2

ARG KEYCLOAK_VERSION

FROM maven:3-eclipse-temurin-21 AS builder
# build a custom extensions for keycloak using maven

ARG KEYCLOAK_VERSION
WORKDIR /build
COPY ./src /build/src
COPY ./pom.xml /build
RUN --mount=type=cache,target=/root/.m2 set -x && \
    export SKIP_INTEGRATION_TESTS=true && \
    mvn -B package -Drevision=${KEYCLOAK_VERSION}

FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION} AS base
# Base image that the test and production images derive from

# get the compiled extensions
COPY --from=builder --chown=keycloak:keycloak /build/target/keycloak-extensions-*-jar-with-dependencies.jar /opt/keycloak/providers/

# OFF theme
COPY --chown=keycloak:keycloak theme/off /opt/keycloak/themes/off

# OFF specific configurations
COPY --chown=keycloak:keycloak runtime-scripts /opt/off

RUN mkdir -p ~/off

FROM base AS testcontainer
# For test we pre-load the configuration into a dev-file database to minimize startup time

ENV KC_BOOTSTRAP_ADMIN_USERNAME=root
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=root-test-password
ENV KC_HOSTNAME=http://keycloak:8080
ENV KC_HOSTNAME_BACKCHANNEL_DYNAMIC=true
ENV SMTP_SERVER=smtp

# Note have to put the following in a separate script as RUN doesn't seem to cope with starting a background process (& suffix)
RUN sh /opt/off/configure_testcontainer.sh

# Need quite a long grace period for startup because of running migrations
HEALTHCHECK --start-period=300s --interval=1s CMD timeout 1s bash -c 'echo > /dev/tcp/localhost/8080'

ENTRYPOINT [ "/opt/keycloak/bin/kc.sh", "start", "--optimized", "--http-enabled=true", "--cache=local" ]

FROM base
# Production image. This is also used for dev. Health and metrics don't seem to add too much to the startup time

RUN /opt/keycloak/bin/kc.sh build --db=postgres --health-enabled=true --metrics-enabled=true

# Need quite a long grace period for startup because of running migrations
HEALTHCHECK --start-period=300s --interval=1s CMD timeout 1s bash -c 'test -f /tmp/health && :> /dev/tcp/localhost/8080'

ENTRYPOINT [ "sh", "/opt/off/startup.sh" ]

