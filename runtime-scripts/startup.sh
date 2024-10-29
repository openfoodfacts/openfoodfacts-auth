# Running configuration after startup inspired by: https://keycloak.discourse.group/t/keycloak-x-docker-startup-scripts-not-being-executed/8208/6?u=famod
echo "*** Starting background process ***"
sh /etc/off/after_startup.sh &
echo "*** Starting keycloak ***"

if [[ "$KEYCLOAK_STARTUP" == "dev" ]]; then
    echo "Starting in dev mode"
    /opt/keycloak/bin/kc.sh start-dev --http-enabled=true --health-enabled=true --metrics-enabled=true
else
    echo "Starting in production mode"
    # Note the following options are set in the build in the Dockerfile:
    # --health-enabled=true --metrics-enabled=true
    /opt/keycloak/bin/kc.sh start --optimized --http-enabled=true
fi

