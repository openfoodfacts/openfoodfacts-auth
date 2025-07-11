# Configuration

This folder contains scripts that are executed as part of the Keycloak startup process to configure the Open Food Facts realm.

The startup.sh script runs an after_startup.sh script in the background which waits for keycloak to start and then can run arbitrary updates to realm configuration.

## Test Clients

For the dev and testcontainer images three test clients are created, as follows:

 - test_client: A confidential client with limited permissions
 - test_public_client: A public client (suitable for use in the PKCE login flow)
 - OFF: A client with permission to manage users, as would be used by Product Opener

## Custom Fields

Custom fields are defined in the `runtime-scripts/user_profiles.json` file.

Pick lists can be localized using this kind of structure:

```json
    {
      "name": "country",
      "displayName": "${country}",
      "validations": {
        "options": {
          "options": [
            "uk",
            "es",
            "fr"
          ]
        }
      },
      "annotations": {
        "inputType": "select",
        "inputOptionLabels": {
          "uk": "${united-kingdom}",
          "es": "${spain}",
          "fr": "${france}"
        }
      },
      "permissions": {
        "view": [
          "admin",
          "user"
        ],
        "edit": [
          "admin",
          "user"
        ]
      }
    }
```

The `refresh_messages` script will update this JSON file with the list of values for Countries.

Note that only attributes relevant to all Open Food Facts services should be stored in Keycloak. Specific service user preferences should be stored in each service. For example, Product Opener stores these in the user.sto files.

## Making future realm changes

The import realm facility on startup loads the configuration from `openfoodfacts-realm.json` but this will not update an existing realm with any configuration changes. Changes that need to be applied to existing realms need to be added to the `realm_settings_template.json` file.

Note that these template files contain '%' placeholders which are used in the `after_startup.sh` script, so make sure that the order of these is not changed. Also note that the `refresh_messages` script updates these templates and will sort all object keys alphabetically for clearer diffs.

### Backward compatibility

Username password authentication is still needed for now, which will use the password grant type (deprecated in OAuth 2.1). This is enabled using the `directAccessGrantsEnabled` key in the `test_client.json` file.
