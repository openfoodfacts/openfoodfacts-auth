function wait_for_keycloak() {
  local -r MAX_WAIT=120
  local config_command
  local wait_time

  config_command="/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --user $KC_BOOTSTRAP_ADMIN_USERNAME --password $KC_BOOTSTRAP_ADMIN_PASSWORD --realm master"
  wait_time=0

  # Waiting for the application to return a 200 status code.
  until ${config_command}; do
    if [[ ${wait_time} -ge ${MAX_WAIT} ]]; then
      echo "$(date -u) *** The application service did not start within ${MAX_WAIT} seconds. Aborting. ***"
      exit 1
    else
      echo "$(date -u) *** Waiting (${wait_time}/${MAX_WAIT}) ... ***"
      sleep 1
      ((++wait_time))
    fi
  done

  echo "$(date -u) *** Keycloak is now accepting requests. ***"
}

# Docker healthcheck waits for this file to appear and for port to be open
rm -f /tmp/health

# Waiting for Keycloak to start before proceeding with the configurations.
wait_for_keycloak

# Keycloak is running. Check to see if if this is a new build, in which case apply realm settings
# Note the /opt/off folder holds read-only data and ~/off holds data that is generated during script runs
# They are kept separate as we mount /opt/off to a local folder during development to avoid rebuilds but that
# creates permission issues in GitHub actions if we attempt to write back to the folder from the container
if [ -f ~/off/deployed_image_id ] && [[ `cat /opt/off/image_id` == `cat ~/off/deployed_image_id` ]]; then
    echo "$(date -u) *** Build is unchanged ***"
else
  echo "$(date -u) *** Configuring Keycloak ***"

  # Migrate old realm name
  echo "$(date -u) *** Checking if open-products-facts realm exists ***"
  /opt/keycloak/bin/kcadm.sh get realms/open-products-facts --fields realm &> /dev/null
  if [[ $? == 0 ]]; then
    echo "$(date -u) *** Renaming realm ***"
    /opt/keycloak/bin/kcadm.sh update realms/open-products-facts -s realm=openfoodfacts -s displayName="Open Food Facts"
  else
    # Import (not performed at startup) does not interpolate variables https://github.com/keycloak/keycloak/issues/12069
    echo "$(date -u) *** Checking if realm exists ***"
    /opt/keycloak/bin/kcadm.sh get realms/openfoodfacts --fields realm &> /dev/null
    if [[ $? != 0 ]]; then
      echo "$(date -u) *** Importing realm ***"
      /opt/keycloak/bin/kcadm.sh create realms -f /opt/off/openfoodfacts_realm.json
    fi
  fi

  # Note the realm import won't update an existing realm so the following are done explicitly as they
  # are more likely to change between releases
  # We use printf to do this as envsubst isn't available in the standard Keycloak image
  # Need to make sure arguments are added in the right order. 
  # Note refresh_messages will sort JSON templates alphabetically by key. 
  REALM_SETTINGS=$(cat /opt/off/realm_settings_template.json)

  # smtpServer.host: $SMTP_SERVER
  printf "$REALM_SETTINGS" \
    "$SMTP_SERVER" \
    > ~/off/interpolated_realm_settings.json

  # Apply latest settings, e.g. SMTP server
  echo "$(date -u) *** Applying realm settings ***"
  /opt/keycloak/bin/kcadm.sh update realms/openfoodfacts -f ~/off/interpolated_realm_settings.json
  # Set up user attributes
  echo "$(date -u) *** Configuring user profiles ***"
  /opt/keycloak/bin/kcadm.sh update users/profile -r openfoodfacts -f /opt/off/users_profile.json

  cp /opt/off/image_id ~/off/deployed_image_id
fi

# Only create test clients in dev mode. When we build the test image we call this script in dev mode
# so that the clients are created and then persisted in the dev-file database.
if [[ "$KEYCLOAK_STARTUP" == "dev" ]]; then
  echo "$(date -u) *** Creating test clients ***"
  # Create clients
  for CLIENT_ID in OFF test_client test_public_client
  do
    echo "$(date -u) *** Checking if client $CLIENT_ID exists ***"
    EXISTING_CLIENT=$(/opt/keycloak/bin/kcadm.sh get clients/?clientId=$CLIENT_ID -r openfoodfacts  --fields clientId)
    if [[ "$EXISTING_CLIENT" == "[ ]" ]];then
      echo "$(date -u) *** Creating client $CLIENT_ID ***"
      /opt/keycloak/bin/kcadm.sh create clients -r openfoodfacts -f /opt/off/$CLIENT_ID.json
    fi
  done
  # The off client has additional permissions but can't import client role mappings with the user. Note generated user name is always in lower case
  echo "$(date -u) *** Assigning role mappings for client OFF ***"
  /opt/keycloak/bin/kcadm.sh add-roles -r openfoodfacts --uusername service-account-off --cclientid realm-management --rolename manage-users --rolename query-users
  echo "$(date -u) *** Test clients created ***"
fi

echo Healthy > /tmp/health
echo "$(date -u) *** Keycloak is healthy ***"
