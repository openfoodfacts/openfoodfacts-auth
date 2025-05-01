# Running configuration after startup inspired by: https://keycloak.discourse.group/t/keycloak-x-docker-startup-scripts-not-being-executed/8208/6?u=famod

# Generate a unique config id from the image and environment. Don't include hostname as that is the container id
# Note the /opt/off folder holds read-only data and ~/off holds data that is generated during script runs
# They are kept separate as we mount /opt/off to a local folder during development to avoid rebuilds but that
# creates permission issues in GitHub actions if we attempt to write back to the folder from the container
mkdir -p ~/off
echo "$(printenv | grep -v '^HOSTNAME' ; cat /opt/off/image_id)" | md5sum > ~/off/config_id
if [ -f ~/off/deployed_config_id ] && [[ `cat ~/off/config_id` == `cat ~/off/deployed_config_id` ]]; then
    echo "*** Config is unchanged ***"
    echo Healthy > /tmp/health
else
    echo "*** Starting background process ***"
    sh /opt/off/after_startup.sh &
fi

if [[ "$KEYCLOAK_STARTUP" == "dev" ]]; then
    echo "*** Starting keycloak in development mode ***"
    # In dev mode we still use the PostgreSQL database but use start-dev so that themes are dynamically reloaded
    /opt/keycloak/bin/kc.sh start-dev --db=postgres --http-enabled=true --health-enabled=true --metrics-enabled=true --verbose
elif [[ "$KEYCLOAK_STARTUP" == "prod" ]]; then
    echo "*** Starting keycloak in production mode ***"
    # Note can't use optimized as we use that for test containers and it doesn't include postgres
    /opt/keycloak/bin/kc.sh start --db=postgres --http-enabled=true --health-enabled=true --metrics-enabled=true --proxy-headers xforwarded
else
    echo "*** Starting keycloak in test mode ***"
    # Use pre-optimized image with dev-file database for integration tests from other projects (like Product Opener)
    # for faster startup and minimal dependencies.
    /opt/keycloak/bin/kc.sh start --optimized --http-enabled=true --cache=local
fi
