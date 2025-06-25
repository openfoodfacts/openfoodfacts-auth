echo "$(date -u) *** Starting keycloak in configure test mode ***"
/opt/keycloak/bin/kc.sh start --optimized --http-enabled=true --cache=local --verbose --spi-theme-static-max-age=-1 --spi-theme-cache-themes=false --spi-theme-cache-templates=false &
# Run the after_setup script in dev mode so that test clients are created and persisted in the test image
KEYCLOAK_STARTUP=dev sh /opt/off/after_startup.sh
