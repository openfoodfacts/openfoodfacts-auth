# Note tried using dev-mem but is unpredictable when used in PO integration tests
# dev-file also means we can pre-bake all of the configuration into the image
echo "$(date -u) *** Building optimized Keycloak image ***"
/opt/keycloak/bin/kc.sh build --db=dev-file

echo "$(date -u) *** Starting keycloak in configure testcontainer mode ***"
# Start Keycloak as a background process. Capture the pid with $! so we can shut it down gracefully
/opt/keycloak/bin/kc.sh start --optimized --http-enabled=true --cache=local --verbose &
KEYCLOAK_PID=$!

# Run the after_setup script so that test clients are created and persisted in the test image's dev-file database
sh /opt/off/after_startup.sh

# Need to kill the process gracefully so that all data is written back to the dev-file database
echo "$(date -u) *** Sending kill to keycloak PID $KEYCLOAK_PID ***"
kill $KEYCLOAK_PID
echo "$(date -u) *** Waiting for keycloak PID $KEYCLOAK_PID to exit ***"
wait $KEYCLOAK_PID || true
