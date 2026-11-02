function wait_for_keycloak() {
  local -r MAX_WAIT=120
  local wait_time=1

  echo "$(date -u) *** Checking Keycloak status. ***"

  while [ $wait_time -le $MAX_WAIT ]; do
    # Open a socket to the health check. Complicated syntax ensure connection refused errors don't appear in the logs
    RESPONSE=$((exec 3<>/dev/tcp/127.0.0.1/9000 && printf "GET /health/ready HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n" >&3 && cat <&3) 2> /dev/null)

    # If the socket opened successfully, RESPONSE will contain Keycloak's HTTP reply.
    # We parse the variable instead of relying on active file descriptors.
    if echo "$RESPONSE" | grep -q "HTTP/1.1 200 OK"; then
        echo "$(date -u) *** Keycloak is now accepting requests. ***"
        break
    fi

    echo "$(date -u) *** Waiting (${wait_time}/${MAX_WAIT}) ... ***"
    sleep 1
    ((++wait_time))
  done

  if [ $wait_time -gt $MAX_WAIT ]; then
      echo "$(date -u) *** The application service did not start within ${MAX_WAIT} seconds. Aborting. ***"
      exit 1
  fi
}

# Docker healthcheck waits for this file to appear and for port to be open
rm -f /tmp/health

# Waiting for Keycloak to start before proceeding with the configurations.
wait_for_keycloak

# Keycloak is running. Check to see if if this is a new build, in which case apply realm settings
# Note the /opt/off folder holds read-only data and ~/off holds data that is generated during script runs
# They are kept separate as we mount /opt/off to a local folder during development to avoid rebuilds but that
# creates permission issues in GitHub actions if we attempt to write back to the folder from the container
DEPLOYED_VERSION=$(cat ~/off/deployed_image_version 2> /dev/null || echo 0)
CURRENT_VERSION=$(cat /opt/off/image_version)
if [[ $CURRENT_VERSION == $DEPLOYED_VERSION ]]; then
  echo "$(date -u) *** Build is unchanged ***"
else
  echo "$(date -u) *** Configuring Keycloak ***"

  # Ideally log in as the migration user
  LOGIN_COMMAND="/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --user $KC_MIGRATIONS_USERNAME --password $KC_MIGRATIONS_PASSWORD --realm master &> /dev/null"
  if eval $LOGIN_COMMAND; then
    echo "$(date -u) *** Logged in as $KC_MIGRATIONS_USERNAME ***"
  else
    if /opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --user $KC_BOOTSTRAP_ADMIN_USERNAME --password $KC_BOOTSTRAP_ADMIN_PASSWORD --realm master &> /dev/null; then
      echo "$(date -u) *** Logged in as $KC_BOOTSTRAP_ADMIN_USERNAME ***"
      # TODO: Create realm here and create migration user with privileges
      echo "$(date -u) *** Importing realm ***"
      /opt/keycloak/bin/kcadm.sh create realms -f /opt/off/openfoodfacts_realm.json

      # Create the migration user
      /opt/keycloak/bin/kcadm.sh create users -r master -s username=$KC_MIGRATIONS_USERNAME -s enabled=true -s 'credentials=[{"type": "password", "value": "'$KC_MIGRATIONS_PASSWORD'", "temporary": false}]'

      # Just give permissions to the openfoodfacts realm
      /opt/keycloak/bin/kcadm.sh add-roles -r master --uusername $KC_MIGRATIONS_USERNAME --cclientid openfoodfacts-realm --rolename manage-realm --rolename manage-clients --rolename manage-users

      # Re-login as the migrations user  
      if eval $LOGIN_COMMAND; then
        echo "$(date -u) *** Logged in as $KC_MIGRATIONS_USERNAME ***"
      else
        echo "$(date -u) *** Failed to log in as $KC_MIGRATIONS_USERNAME after creating realm. Aborting. ***"
        exit 1
      fi
    else
      echo "$(date -u) *** Failed to log in"
      exit 1
    fi
  fi

  # Note the configurations below are always applied to pick up language and country changes
  # Further version-specific migrations can be added to the end
  REALM_DISPLAY_NAME="Open Food Facts"
  if [[ "$KEYCLOAK_STARTUP" == "dev" ]]; then
    REALM_DISPLAY_NAME="Open Food Facts [DEV]"
  elif [[ "$KEYCLOAK_STARTUP" == "staging" ]]; then
    REALM_DISPLAY_NAME="Open Food Facts [STAGING]"
  fi

  # Note the realm import won't update an existing realm so the following are done explicitly as they
  # are more likely to change between releases
  # We use printf to do this as envsubst isn't available in the standard Keycloak image
  # Need to make sure arguments are added in the right order. 
  # Note refresh_messages will sort JSON templates alphabetically by key. 
  REALM_SETTINGS=$(cat /opt/off/realm_settings_template.json)

  # These are the current placeholders, in order. Note these are sorted
  # displayName
  # smtpServer.auth
  # smtpServer.fromDisplayName
  # smtpServer.host
  # smtpServer.password
  # smtpServer.port
  # smtpServer.user
  printf "$REALM_SETTINGS" \
    "$REALM_DISPLAY_NAME" \
    "$SMTP_AUTH" \
    "$REALM_DISPLAY_NAME" \
    "$SMTP_SERVER" \
    "$SMTP_PASSWORD" \
    "$SMTP_PORT" \
    "$SMTP_USER" \
    > ~/off/interpolated_realm_settings.json

  # Apply latest settings, e.g. SMTP server
  echo "$(date -u) *** Applying realm settings ***"
  /opt/keycloak/bin/kcadm.sh update realms/openfoodfacts -f ~/off/interpolated_realm_settings.json
  # Set up user attributes
  echo "$(date -u) *** Configuring user profiles ***"
  /opt/keycloak/bin/kcadm.sh update users/profile -r openfoodfacts -f /opt/off/users_profile.json

  # Only create test clients in dev or test mode.
  if [[ "$KEYCLOAK_STARTUP" == "dev" ]] || [[ "$KEYCLOAK_STARTUP" == "test" ]]; then
    echo "$(date -u) *** Creating test clients ***"
    # Create clients
    for CLIENT_ID in OFF test_client test_public_client
    do
      echo "$(date -u) *** Checking if client $CLIENT_ID exists ***"
      EXISTING_CLIENT=$(/opt/keycloak/bin/kcadm.sh get clients/?clientId=$CLIENT_ID -r openfoodfacts  --fields clientId 2> /dev/null)
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

  # Migration: ensure the products:write client scope exists.
  # The realm JSON import above only runs for new instances, so existing
  # realms (staging, production, long-lived dev volumes) need this explicitly.
  # All probes are idempotent: re-running against an up-to-date realm is a no-op.
  echo "$(date -u) *** Ensuring products:write client scope ***"
  SCOPE_LIST=$(/opt/keycloak/bin/kcadm.sh get client-scopes -r openfoodfacts --fields id,name 2> /dev/null)
  PRODUCTS_WRITE_ID=$(echo "$SCOPE_LIST" | grep -B5 '"name"[ ]*:[ ]*"products:write"' | grep -o '"id"[ ]*:[ ]*"[^"]*"' | head -1 | cut -d'"' -f4)
  PRODUCTS_READ_ID=$(echo "$SCOPE_LIST" | grep -B5 '"name"[ ]*:[ ]*"products:read"' | grep -o '"id"[ ]*:[ ]*"[^"]*"' | head -1 | cut -d'"' -f4)
  if [[ -z "$PRODUCTS_WRITE_ID" ]]; then
    echo "$(date -u) *** Creating products:write client scope ***"
    /opt/keycloak/bin/kcadm.sh create client-scopes -r openfoodfacts -f /opt/off/products_write_scope.json
    SCOPE_LIST=$(/opt/keycloak/bin/kcadm.sh get client-scopes -r openfoodfacts --fields id,name 2> /dev/null)
    PRODUCTS_WRITE_ID=$(echo "$SCOPE_LIST" | grep -B5 '"name"[ ]*:[ ]*"products:write"' | grep -o '"id"[ ]*:[ ]*"[^"]*"' | head -1 | cut -d'"' -f4)
  fi
  if [[ -n "$PRODUCTS_WRITE_ID" ]]; then
    echo "$(date -u) *** Ensuring products audience mapper ***"
    MAPPERS=$(/opt/keycloak/bin/kcadm.sh get client-scopes/$PRODUCTS_WRITE_ID/protocol-mappers/models -r openfoodfacts 2> /dev/null)
    if ! echo "$MAPPERS" | grep -q '"included.custom.audience"[ ]*:[ ]*"products"'; then
      echo "$(date -u) *** Creating products audience mapper ***"
      /opt/keycloak/bin/kcadm.sh create client-scopes/$PRODUCTS_WRITE_ID/protocol-mappers/models -r openfoodfacts -f /opt/off/products_write_audience_mapper.json
    fi
  else
    echo "$(date -u) *** Failed to determine products:write scope id, skipping mapper and client setup ***"
  fi

  # Test clients created from an older JSON revision lack the new optional scope,
  # as creation above is skipped when the client already exists. Fix up mappings.
  # The products:read scope was dropped, so it is also removed from clients that
  # already have it (e.g. dev volumes from the draft PR).
  if [[ "$KEYCLOAK_STARTUP" == "dev" ]] || [[ "$KEYCLOAK_STARTUP" == "test" ]]; then
    if [[ -n "$PRODUCTS_WRITE_ID" ]]; then
      for CLIENT_ID in OFF test_client test_public_client
      do
        CLIENT_UUID=$(/opt/keycloak/bin/kcadm.sh get clients/?clientId=$CLIENT_ID -r openfoodfacts --fields id 2> /dev/null | grep -o '"id"[ ]*:[ ]*"[^"]*"' | head -1 | cut -d'"' -f4)
        if [[ -n "$CLIENT_UUID" ]]; then
          ASSIGNED_SCOPES=$(/opt/keycloak/bin/kcadm.sh get clients/$CLIENT_UUID/optional-client-scopes -r openfoodfacts --fields name 2> /dev/null)
          if ! echo "$ASSIGNED_SCOPES" | grep -q '"name"[ ]*:[ ]*"products:write"'; then
            echo "$(date -u) *** Assigning products:write scope to client $CLIENT_ID ***"
            /opt/keycloak/bin/kcadm.sh update clients/$CLIENT_UUID/optional-client-scopes/$PRODUCTS_WRITE_ID -r openfoodfacts
          fi
          if echo "$ASSIGNED_SCOPES" | grep -q '"name"[ ]*:[ ]*"products:read"'; then
            READ_SCOPE_ID=$(/opt/keycloak/bin/kcadm.sh get client-scopes -r openfoodfacts --fields id,name 2> /dev/null | grep -B5 '"name"[ ]*:[ ]*"products:read"' | grep -o '"id"[ ]*:[ ]*"[^"]*"' | head -1 | cut -d'"' -f4)
            if [[ -n "$READ_SCOPE_ID" ]]; then
              echo "$(date -u) *** Removing products:read scope from client $CLIENT_ID ***"
              /opt/keycloak/bin/kcadm.sh delete clients/$CLIENT_UUID/optional-client-scopes/$READ_SCOPE_ID -r openfoodfacts
            fi
          fi
        fi
      done
    fi
  fi

  # Finally delete the dropped products:read scope itself where it was already
  # created. Client mappings above are removed first so this works regardless
  # of whether Keycloak cascades the delete.
  if [[ -n "$PRODUCTS_READ_ID" ]]; then
    echo "$(date -u) *** Removing obsolete products:read client scope ***"
    /opt/keycloak/bin/kcadm.sh delete client-scopes/$PRODUCTS_READ_ID -r openfoodfacts
  fi

  # Can do further migrations here by comparing DEPLOYED_VERSION and CURRENT_VERSION

  cp /opt/off/image_version ~/off/deployed_image_version
fi

echo Healthy > /tmp/health
echo "$(date -u) *** Keycloak is healthy ***"
