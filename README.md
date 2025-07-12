# Open Food Facts Auth

This Project provides authentication services for Open Food Facts using Keycloak, backed by a PostgreSQL database.

The primary responsibility of this service is to support user authentication and high-level authorization. Not all attributes we store about a user will be stored in Keycloak. For example, Product Opener user preferences, like whether to show barcodes, will still be stored in Product Opener.

Ultimately all user and re-user authentication should take place via Keycloak. Other Open Food Facts projects should not be prompting users for their username and password, but instead redirecting to Keycloak. This will allow us to support other authentication methods like Passkeys and social login in the future. However, username and password authentication APIs are currently still provided while all services transition.

# Configuring Clients

No clients are pre-configured in the production and staging instances. We only use OIDC clients (not SAML). Clients are configured on the Open Food Facts realm (not master).

## Internal Backend Client

This configuration would only be used for our internal clients that needs to be able query / update, like Product Opener:

* Client authentication: enabled
* Authentication flows: Standard flow, Direct access grants, Service account roles
* Root URL: https://world.openfoodfacts.org/ (or as appropriate)
* Home URL: (blank)
* Valid redirect URLs: cgi/oidc_signin_callback.pl
* Valid post logout redirect URIs: cgi/oidc_signout_callback.pl
* Web origins: +

Go to the service account user for the client (e.g. service-account-off) and join the "User management" group which will assign the realm-management:manage-users and realm-management:query-users roles.

Securely share the randomly generated Client Secret with the client.

## Public External Clients

This applies to clients that just need to be able to initiate a PKCE login flow for a user, such as off-explorer:

* Client authentication: disabled (this makes it a public client)
* Authentication flows: Standard flow (do not enable any other flows)
* Root URL, Home URL, Valid redirect URLs, Valid post logout redirect URIs: As specified by the client
* Web origins: +

There is no service account for these types of client and no secret, so only the Client ID needs to be shared with the client.

## Private External Clients

These would be used if the client has a backend that is able to perform the code for token exchange.

The configuration is the same as for a Public client except that Client authentication is enabled so there will be a secret to share with the client.

# Configuring Users

The default root user should not be used and every administrator should be a specific named individual. Keycloak administrators are added to the master realm.

## Full Administrators

These will have access to all roles and be able to create additional users.

## Open Food Facts administrators

These will have full access to the Open Food Facts realm so can add new clients, reset user passwords, etc.

# Components of the Project

Different aspects of the Keycloak deployment are managed by the following components of this project:

## [Customizations](src/README.md)

This is where customizations to the Keycloak server behavior are maintained. Code is written in Java. This code manages the legacy password hashing that allowed us to migrate users without them having to change their passwords and also generates Redis events for key user activities like initial registration and deletion.

## [Configuration](runtime-scripts/README.md)

These scripts apply the specific Open Food Facts configuration parameters to the Keycloak instance. This includes setting up clients for Product Opener, user attribute definitions and supported locales.

## [Themes](theme/README.md)

This is where the Keycloak UI is customized to meet Open Food Facts requirements. Most of this is done using CSS but in some cases the Keycloak templates have been overridden.

## [Localization](src/messages/README.md)

The localization message files are shared between the Java source and Themes and linked through to Crowdin.

## [Tests](tests/README.md)

We use Playwright to drive the Keycloak user interface and perform end to end testing of the Keycloak deployment.

# Local Development

First, run `make dev` to load dependencies and build the container image. Them use `make up` to start the services.

To see how a user logs in you can navigate to: http://auth.openfoodfacts.localhost:5600/realms/openfoodfacts/account/#/

For more detailed debug information you can also use the test client with the following URL:

http://auth.openfoodfacts.localhost:5604/?clientId=test-client&clientSecret=test-secret123&lang=en&keycloak=http%3A%2F%2Fauth.openfoodfacts.localhost%3A5600%2Frealms%2Fopenfoodfacts

If you create a new user account you will need to validate the email address used. The validation email can be found in SMTP4Dev here: http://localhost:5605/

# Environment

The settings in `.env` are designed to support the default local setup. Use `.envrc` to override settings locally. Descriptions of each field are included in the `.env` file.

# Applying Keycloak Updates

The Keycloak version to be used is specified in the `.env` file. However, in addition to updating this there are a number of other steps that need to be completed:

## Refresh Themes

We keep a copy of the Keycloak themes in Git so that we can see what has changed between versions. Run `make refresh_themes` to refresh this copy (stored in the `theme` folder).

`make refresh_themes` also calls `make update-keycloak_version` which refreshes the version numbers in the `pom.xml` file.

Note: This requires a JRE in `$PATH`.

## Refresh Overridden Templates

We have overridden a small number of standard Keycloak templates where needed. Make sure you refresh these templates from the original Keycloak ones if they have changed and re-apply our overrides if they are still needed. All templates containing overrides will contain a comment like:

```html
<!-- OFF specific changes: ...
```

If you need to override a new template make sure it is listed in the `refresh_themes` target of the `Makefile` so that we can track further changes made by Keycloak to that template. Please try and write a Playwright test to cover any specific overrides, so we know when it is safe to remove them.

## Build

Run `make build` to update the container images.

## Test

Make sure you re-run the end to end tests with `make test` after a Keycloak upgrade. Pay particular attention to the screen snapshots is it is often necessary to update the custom CSS for the OFF theme after a Keycloak upgrade.

# Roadmap

## Mobile

We will need to update the mobile application to launch the keycloak login and account pages before we can deprecate the password grant type option.

## Client Credentials for APIs

API consumers will need to be set up as Clients in Keycloak. Need to figure out how the sign-up process will work.

## Support Alternative Login

Once all apps are going through Keycloak for authentication we can start to support things like Social Login and Passkeys.

## 🎨 Design & User interface
- We strive to thoughfully design every feature before we move on to implementation, so that we respect Open Food Facts' graphic charter and nascent design system, while having efficient user flows.
- [![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?logo=figma&logoColor=white) Keycloak user flows](https://www.figma.com/design/lQSExloZB3G2cn9acIGy6m/User-flows---Keycloak?m=auto&t=wRSYmglFiDZ8CauF-6)
<br><br>
