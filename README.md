# Open Food Facts Auth

This Project provides authentication services for Open Food Facts using Keycloak, backed by a PostgreSQL database.

# Running Keycloak standalne

First, run `make build` to create the realm.json file with variables substituted. It seems that the standalone import for keycloak does not interpolate variables https://github.com/keycloak/keycloak/issues/12069

Then use `docker compose up -d --build` to build and run the container.

To see how a user logs in you can navigate to: http://auth.openfoodfacts.localhost:5600/realms/open-products-facts/account/#/

# Tests

We use Playwright to test the Keycloak user interface and styling. We recommend using the "Playwright Test for VSCode" plugin.

# Applying Keycloak Updates

The Keycloak version to be used is specified in the .env file. However, in addition to updating this there are a number of other steps that need to be completed:

## Refresh Themes

We keep a copy of the Keycloak themes in Git so that we can see what has changed between versions. Run `make refresh_themes` to refresh this copy (stored in the `theme` folder).

Note: This requires a JRE in `$PATH`.

## Refresh Overridden Templates

We have overridden a small number of standard Keycloak templates where needed. Make sure you refresh these templates from the original Keycloak ones if they have changed and re-apply our overrides if they are still needed. All templates containing overrides will contain a comment like:

```html
<!-- OFF specific changes: ...
```

Please try and write a Playwright test to cover any specific overrides, so we know when it is safe to remove them.

## Make sure you have refreshed Playwright

Run `make init` to refresh any Playwright binaries. Note you may need to restart VSCode if you are using the Playwright extension.

## Build

Run `make build` to finally update the container images.

# Major Workstreams

## First Release

### User Migration

This is mostly taken care of. The scrypt has provider ensures users will not need to change their passwords. [README.md](src/README.md)

### Secrity

[ ] Figure out how applications can register a client_id and get a client_secret

Steps to creating a client:

POST /admin/realms/open-products-facts/clients

```json
{
    "clientId": "{new client}",
    "secret": "{new secret}",
    "directAccessGrantsEnabled": true,
    "serviceAccountsEnabled": true
}
```

Get the client id:

GET /admin/realms/open-products-facts/clients?clientId={new client}

Get the user for the client:

GET /admin/realms/{realm}/clients/{id}/service-account-user

Following should probably be done by linking the user to a group, but ad-hoc...

Get the realm-management client

GET /admin/realms/open-products-facts/clients?clientId=realm-management

Get the id of the manage-users role:

GET /admin/realms/open-products-facts/users/{service-account-user-id}/role-mappings/clients/{realm-management-id}/available

Assign the role

POST /admin/realms/{realm}/users/{service-account-user-id}/role-mappings/clients/{realm-management-id}

```json
[{
    "id": "{Id from previous get}",
    "name": "manage-users"
}]
```


[ ] Work out how to limit access to the management console
[ ] Make sure any tools that can export users are disabled

### Database

Need to move storage to Postgres. Will also need a script to update the user attributes to a text column https://stackoverflow.com/questions/44851052/max-size-of-custom-user-attribute-in-keycloak

This script will need to run from after_startup.sh. Or maybe could be part of the Delete User event listener. Writing it in Java will avoid installing the full postgres client.

### Theming

Need to decide how similar we want to make the screens to the main pages. Some issues to consider:

 - How the locale is shown and passed through
 - Displaying current banners, e.g. donation prompts
 - General headers and footers

It looks like the CSS classes are very specific and so I suspect these could change with Keycloak releases. We therefore probably want a robust set of tests to ensure that themes are being applied correctly.

Currently the common.css file has to be copied between theme pages (account, login, etc.). Tried using a symlink but this didn't work.

### Localization

We will need to ensure that all of the current OFF locales are covered with suitable translations.

[ ] Setup Crowdin yaml and GitHub actions
[ ] Ensure language parameter is passed to Keycloak and back to calling app

### Fields

All of the user editable fields need to be available on the account UI with any necessary validation.

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

Fetch the current language and country taxonomies from OFF as part of the release process to populate this.

We will probably stil need to retain User.sto files for now containing data the user doesn't see for compatibility with OPF, OBF and OPFF.

#### Languages

This list would always show each language in its own translation, e.g. "English, Français, 汉语".

The script will read the language.json and for each langauage use the language_code_2 to look up the name. If no name is found in that language then the "en" translation will be used and if that cannot be found then the id of the entry will be used (with the "en:" prefix).

#### Countries

The basic list will simply consist of placeholders for all the entries which will link to translations in a message file.

The script will therefore have to create a message file for each known language and add all countries to that.


### Backward compatibility

Username password authentication is still needed for now, which will use the password grant type (deprecated in OAuth 2.1).

We still also need to provide minimal user forms for the Smoothie mobile app to scrape.

We will need to update OPF, OBF and OPPF branches to use the password grant type for authentication and ensure that all other account activities are delegated to OFF.

### Delete User

We will need an event listener to pick up the user deleted event so that user names can be wiped from contributions. Maybe create a table in the Keycloak database so we can track for other applications too.

### Making future realm changes

The import realm facility on startup will not update an existing realm with any configuration changes.

The startup.sh script runs an after_startup.sh script in the background which waits for keycloak to start and then can run arbitrary updates to realm configuration.

## Deprecate Non-keycloak Authentication

### Mobile

We will need to update the mobile applicaiton to launch the keycloak login and account pages before we can deprecate the password grant type option.

### Client Credentials for APIs

API consumers will need to be set up as Clients in Keycloak. Need to figure out how the sign-up process will work.

## Deprecate User .sto Files

This can run in parallel witht the above. Will need more extensive updates to OPF, OBF and OPPF.

## Support Alternative Login

Once all apps are going through Keycloak for authentication we can start to support things like Social Login and Passkeys.
