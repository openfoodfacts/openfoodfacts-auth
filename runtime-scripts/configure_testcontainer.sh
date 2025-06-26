# Note tried using dev-mem but is unpredictable when used in PO integration tests
# dev-file also means we can pre-bake all of the configuration into the image
echo "$(date -u) *** Building optimized Keycloak image ***"
/opt/keycloak/bin/kc.sh build --db=dev-file

echo "$(date -u) *** Starting keycloak in configure testcontainer mode ***"
# Start Keycloak as a background process. We don't kill this off tidily but it doesn't seem to cause any issues
/opt/keycloak/bin/kc.sh start --optimized --http-enabled=true --cache=local --verbose &

# Run the after_setup script in dev mode so that test clients are created and persisted in the test image's dev-file database
KEYCLOAK_STARTUP=dev sh /opt/off/after_startup.sh
