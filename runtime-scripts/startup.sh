# Running configuration after startup inspired by: https://keycloak.discourse.group/t/keycloak-x-docker-startup-scripts-not-being-executed/8208/6?u=famod
echo "*** Starting background process ***"
sh /etc/off/after_startup.sh &
echo "*** Starting keycloak ***"

if [[ "$KEYCLOAK_STARTUP" == "prod" ]]; then
    # TODO: Figure out how to secure properly for production
    # Note can't use optiomized option as pre-built image isn't configured for postgres
    /opt/keycloak/bin/kc.sh start --http-enabled=true --import-realm --health-enabled=true --metrics-enabled=true
elif [[ "$KEYCLOAK_STARTUP" == "dev" ]]; then
    /opt/keycloak/bin/kc.sh start-dev --http-enabled=true --import-realm --health-enabled=true --metrics-enabled=true
else
    # Use pre-optimized version for tests for faster startup
    /opt/keycloak/bin/kc.sh start --http-enabled=true --hostname-strict=false --cache=local --optimized --import-realm
fi

