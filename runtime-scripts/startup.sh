# Running configuration after startup inspired by: https://keycloak.discourse.group/t/keycloak-x-docker-startup-scripts-not-being-executed/8208/6?u=famod
echo "*** Starting background process ***"
sh /etc/off/after_startup.sh &

if [[ "$KEYCLOAK_STARTUP" == "dev" ]]; then
    echo "*** Starting keycloak in development mode ***"
    # In dev mode we still use the PostgreSQL database but use start-dev so that themes are dynamically reloaded
    /opt/keycloak/bin/kc.sh start-dev --http-enabled=true --health-enabled=true --metrics-enabled=true
elif [[ "$KEYCLOAK_STARTUP" == "prod" ]]; then
    echo "*** Starting keycloak in production mode ***"
    # Note the following options are set in the build in the Dockerfile:
    # --health-enabled=true --metrics-enabled=true
    /opt/keycloak/bin/kc.sh start --optimized --http-enabled=true
else
    echo "*** Starting keycloak in test mode ***"
    # Use dev-file database for integration tests from other projects (like Product Opener) for faster startup
    # and minimal dependencies. Can't use pre-optimized image as that is for postgres
    /opt/keycloak/bin/kc.sh start --http-enabled=true --db dev-file
fi
