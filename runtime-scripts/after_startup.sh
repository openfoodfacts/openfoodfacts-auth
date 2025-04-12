function wait_for_keycloak() {
  local -r MAX_WAIT=120
  local config_command
  local wait_time

  config_command="/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --user $KC_BOOTSTRAP_ADMIN_USERNAME --password $KC_BOOTSTRAP_ADMIN_PASSWORD --realm master"
  wait_time=0

  # Waiting for the application to return a 200 status code.
  until ${config_command}; do
    if [[ ${wait_time} -ge ${MAX_WAIT} ]]; then
      echo "$(date -u) The application service did not start within ${MAX_WAIT} seconds. Aborting."
      exit 1
    else
      echo "$(date -u) Waiting (${wait_time}/${MAX_WAIT}) ..."
      sleep 1
      ((++wait_time))
    fi
  done

  echo "$(date -u) Keycloak is now up and running."
}

# Docker healthcheck waits for this file to appear and for port to be open
rm -f /tmp/health


# Import (not performed at startup) does not interpolate variables https://github.com/keycloak/keycloak/issues/12069
# So we need to do the substitution ourselves.
# We use printf to do this as envsubst isn't available in the standard Keycloak image
# Need to make sure arguments are added in the right order. 
# Note refresh_messages will sort JSON templates alphabetically by key. 
REALM_SETTINGS=$(cat /etc/off/realm_settings_template.json)
CLIENT_TEMPLATE=$(cat /etc/off/productopener_client_template.json)

# smtpServer.host: $SMTP_SERVER
printf "$REALM_SETTINGS" \
  "$SMTP_SERVER" \
  > /etc/off/interpolated_realm_settings.json

# Waiting for Keycloak to start before proceeding with the configurations.
wait_for_keycloak

# Keycloak is running.

echo "$(date -u) Configuring Keycloak"

# Import the realm
/opt/keycloak/bin/kcadm.sh get realms/open-products-facts &> /dev/null
if [[ $? != 0 ]]; then
  /opt/keycloak/bin/kcadm.sh create realms -f /etc/off/open-products-facts-realm.json
fi
# Note the realm import won't update an existing realm so the following are done explicitly as they
# are more likely to change between releases

# Apply latest settings, e.g. SMTP server
/opt/keycloak/bin/kcadm.sh update realms/open-products-facts -f /etc/off/interpolated_realm_settings.json
# Set up user attributes
/opt/keycloak/bin/kcadm.sh update users/profile -r open-products-facts -f /etc/off/users_profile.json

# Create clients
for CLIENT in $CLIENTS
do
  IFS=","
  CLIENT_PARTS=($CLIENT)
  unset IFS
  CLIENT_ID=${CLIENT_PARTS[0]}
  CLIENT_URL=${CLIENT_PARTS[1]}
  EXISTING_CLIENT=$(/opt/keycloak/bin/kcadm.sh get clients/?clientId=$CLIENT_ID -r open-products-facts)
  if [[ "$EXISTING_CLIENT" == "[ ]" ]];then
    SECRET_KEY=${CLIENT_ID}_CLIENT_SECRET
    CLIENT_SECRET=\"${!SECRET_KEY}\"
    # If no secret variable is provided then null will generate a new secret
    if [[ "$CLIENT_SECRET" == "\"\"" ]]; then 
      CLIENT_SECRET=null
    fi
    # These are the current parameters in order:
    # clients[0].adminUrl: $CLIENT_URL
    # clients[0].attributes.post.logout.redirect.uris: $CLIENT_URL
    # clients[0].baseUrl: $CLIENT_URL
    # clients[0].clientId: $CLIENT_ID
    # clients[0].name: $CLIENT_ID
    # clients[0].redirectUris: $CLIENT_URL
    # clients[0].rootUrl: $CLIENT_URL
    # clients[0].secret: $CLIENT_SECRET
    printf "$CLIENT_TEMPLATE" \
      "$CLIENT_URL" \
      "$CLIENT_URL" \
      "$CLIENT_URL" \
      "$CLIENT_ID" \
      "$CLIENT_ID" \
      "$CLIENT_URL" \
      "$CLIENT_URL" \
      "$CLIENT_SECRET" \
      > /etc/off/interpolated_client_$CLIENT_ID.json
    /opt/keycloak/bin/kcadm.sh create clients -r open-products-facts -f /etc/off/interpolated_client_$CLIENT_ID.json
    # Can't import client role mappings with the user. Note generated user name is always in lower case
    /opt/keycloak/bin/kcadm.sh add-roles -r open-products-facts --uusername service-account-${CLIENT_ID,,} --cclientid realm-management --rolename manage-users --rolename query-users
  fi
done

echo "$(date -u) Keycloak configuration completed"
echo Healthy > /tmp/health
cp /etc/off/image_id /etc/off/config_id