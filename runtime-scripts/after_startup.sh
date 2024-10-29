function wait_for_keycloak() {
  local -r MAX_WAIT=60
  local config_command
  local wait_time

  config_command="/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --user $KC_BOOTSTRAP_ADMIN_USERNAME --password $KC_BOOTSTRAP_ADMIN_PASSWORD --realm master"
  wait_time=0

  # Waiting for the application to return a 200 status code.
  until ${config_command}; do
    if [[ ${wait_time} -ge ${MAX_WAIT} ]]; then
      echo "The application service did not start within ${MAX_WAIT} seconds. Aborting."
      exit 1
    else
      echo "Waiting (${wait_time}/${MAX_WAIT}) ..."
      sleep 1
      ((++wait_time))
    fi
  done

  echo "Keycloak is now up and running."
}

# Docker healthcheck waits for this file to appear and for port to be open
rm -f /tmp/health

REALM_SETTINGS=$(cat /etc/off/realm_settings_template.json)
PRODUCT_OPENER_CLIENT=$(cat /etc/off/productopener_client_template.json)

# Use printf here as envsubst isn't available in the standard Keycloak image
# Need to make sure arguments are added in the right order. 
# Note refresh_messages will sort JSON alphabetically. 
# These are the current parameters in order:
# clients[0].adminUrl: $PRODUCT_OPENER_URL
# clients[0].attributes.post.logout.redirect.uris: $PRODUCT_OPENER_URL
# clients[0].baseUrl: $PRODUCT_OPENER_URL
# clients[0].redirectUris: $PRODUCT_OPENER_URL
# clients[0].rootUrl: $PRODUCT_OPENER_URL
# clients[0].secret: $PRODUCT_OPENER_OIDC_CLIENT_SECRET
printf "$PRODUCT_OPENER_CLIENT" \
  "$PRODUCT_OPENER_URL" \
  "$PRODUCT_OPENER_URL" \
  "$PRODUCT_OPENER_URL" \
  "$PRODUCT_OPENER_URL" \
  "$PRODUCT_OPENER_URL" \
  "$PRODUCT_OPENER_OIDC_CLIENT_SECRET" \
  > /etc/off/interpolated_productopener_client.json

# smtpServer.host: $SMTP_SERVER
printf "$REALM_SETTINGS" \
  "$SMTP_SERVER" \
  > /etc/off/interpolated_realm_settings.json

# Waiting for Keycloak to start before proceeding with the configurations.
wait_for_keycloak

# Keycloak is running.

echo "Configuring Keycloak"

# Note the realm import done at startup won't update an existing realm so the following 
# are done explicitly as they are more likely to change between releases

# Apply latest settings, e.g. SMTP server
/opt/keycloak/bin/kcadm.sh update realms/open-products-facts -f /etc/off/interpolated_realm_settings.json
# Set up user attributes
/opt/keycloak/bin/kcadm.sh update users/profile -r open-products-facts -f /etc/off/users_profile.json
# Create the ProductOpener client if it doesn't exist
/opt/keycloak/bin/kcadm.sh get clients/c865387e-1275-47f7-948a-fd1b4b166385 -r open-products-facts &> /dev/null
if [[ $? != 0 ]]; then
  /opt/keycloak/bin/kcadm.sh create clients -r open-products-facts -f /etc/off/interpolated_productopener_client.json
fi
# Always update the client with the latest settings
/opt/keycloak/bin/kcadm.sh update clients/c865387e-1275-47f7-948a-fd1b4b166385 -r open-products-facts -f /etc/off/interpolated_productopener_client.json
# Can't import client role mappings with the user
/opt/keycloak/bin/kcadm.sh add-roles -r open-products-facts --uusername service-account-productopener --cclientid realm-management --rolename manage-users --rolename query-users

echo "Keycloak configuration completed"
echo Healthy > /tmp/health
