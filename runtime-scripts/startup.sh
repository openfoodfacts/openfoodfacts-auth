# Running configuration after startup inspired by: https://keycloak.discourse.group/t/keycloak-x-docker-startup-scripts-not-being-executed/8208/6?u=famod

# Generate a unique config id from the image and environment. Don't include hostname as that is the container id
# Note the /opt/off folder holds read-only data and ~/off holds data that is generated during script runs
# They are kept separate as we mount /opt/off to a local folder during development to avoid rebuilds but that
# creates permission issues in GitHub actions if we attempt to write back to the folder from the container
echo "$(date -u) *** Starting background process ***"
sh /opt/off/after_startup.sh &

if [[ "$KEYCLOAK_STARTUP" == "dev" ]]; then
    echo "$(date -u) *** Starting keycloak in development mode ***"
    # In dev mode we still use the PostgreSQL database with additional switches so that themes are dynamically reloaded
    /opt/keycloak/bin/kc.sh start --optimized --http-enabled=true --cache=local --spi-theme-static-max-age=-1 --spi-theme-cache-themes=false --spi-theme-cache-templates=false --verbose
elif [[ "$KEYCLOAK_STARTUP" == "prod" ]]; then
    echo "$(date -u) *** Starting keycloak in production mode ***"
    # Need to enable HTTP for back-channel communication. See https://github.com/openfoodfacts/.github/blob/main/docs/decisions/internal-security.md
    /opt/keycloak/bin/kc.sh start --optimized --http-enabled=true --proxy-headers xforwarded
else
    echo "$(date -u) *** Starting keycloak in test mode ***"
    # Use pre-optimized image with dev-file database for integration tests from other projects (like Product Opener)
    # for faster startup and minimal dependencies. This includes the full configuration to minimize startup time.
    /opt/keycloak/bin/kc.sh start --optimized --http-enabled=true --cache=local
fi
