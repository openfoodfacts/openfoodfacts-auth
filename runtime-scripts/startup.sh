# Running configuration after startup inspired by: https://keycloak.discourse.group/t/keycloak-x-docker-startup-scripts-not-being-executed/8208/6?u=famod
echo "$(date -u) *** Starting background process ***"
sh /opt/off/after_startup.sh &
if [[ "$KEYCLOAK_STARTUP" == "dev" ]]; then
    echo "$(date -u) *** Starting keycloak in development mode ***"
    export EMAIL_BACKGROUND_COLOR=#83e498
    # In dev mode we still use the PostgreSQL database with additional switches so that themes are dynamically reloaded
    /opt/keycloak/bin/kc.sh start --optimized --http-enabled=true --cache=local --spi-theme-static-max-age=-1 --spi-theme-cache-themes=false --spi-theme-cache-templates=false --verbose
else
    echo "$(date -u) *** Starting keycloak in production mode ***"
    if [[ "$KEYCLOAK_STARTUP" == "staging" ]]; then
        # Note can't dynamically change CSS file for emails so have to use explicit environment variables
        export EMAIL_BACKGROUND_COLOR=#b883e4
    fi

    # Need to enable HTTP for back-channel communication. See https://github.com/openfoodfacts/.github/blob/main/docs/decisions/internal-security.md
    /opt/keycloak/bin/kc.sh start --optimized --http-enabled=true --proxy-headers xforwarded
fi
