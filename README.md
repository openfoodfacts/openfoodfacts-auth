# Open Food Facts Auth

This Project provides authentication services for Open Food Facts using Keycloak, backed by a PostgreSQL database.

The primary responsibility of this service is to support user authentication and high-level authorization. Not all attributes we store about a user will be stored in Keycloak. For example, Product Opener user preferences, like whether to show barcodes, will still be stored in Product Opener.

Ultimately all user and re-user authentication should take place via Keycloak. Other Open Food Facts projects should not be prompting users for their username and password, but instead redirecting to Keycloak. This will allow us to support other authentication methods like Passkeys and social login in the future. However, username and password authentication APIs are currently still provided while all services transition.

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

To see how a user logs in you can navigate to: http://auth.openfoodfacts.localhost:5600/realms/open-products-facts/account/#/

For more detailed debug information you can also use the test client with the following URL:

http://auth.openfoodfacts.localhost:5604/?clientId=test-client&clientSecret=test-secret123&lang=en&keycloak=http%3A%2F%2Fauth.openfoodfacts.localhost%3A5600%2Frealms%2Fopen-products-facts

If you create a new user account you will need to validate the email address used. The validation email can be found in SMTP4Dev here: http://localhost:5605/

# Environment

The settings in `.env` are designed to support the default local setup. Use `.envrc` to override settings locally. Descriptions of each field are included in the `.env` file.

# Applying Keycloak Updates

The Keycloak version to be used is specified in the `.env` file. However, in addition to updating this there are a number of other steps that need to be completed:

## Refresh Themes

We keep a copy of the Keycloak themes in Git so that we can see what has changed between versions. Run `make refresh_themes` to refresh this copy (stored in the `theme` folder).

Note: This requires a JRE in `$PATH`.

## Refresh Overridden Templates

We have overridden a small number of standard Keycloak templates where needed. Make sure you refresh these templates from the original Keycloak ones if they have changed and re-apply our overrides if they are still needed. All templates containing overrides will contain a comment like:

```html
<!-- OFF specific changes: ...
```

Please try and write a Playwright test to cover any specific overrides, so we know when it is safe to remove them.

## Build

Run `make build` to finally update the container images.

# Roadmap

## First Objective

The current keycloak branch in the openfoodfcts-server repo has become unmanageable so the suggested plan is to move to an incremental, feature-flag based approach.

The items below list the suggested incremental releasable items in order to achieve the first objective of moving all user authentication into Keycloak:

- Sync users with Keycloak: Keep the existing authentication process the same but ensure that all new users and updates to existing users are replicated in Keycloak. This would include an initial migration. The main difference from the existing migration code is we need to cope with updates as well as creating new users. This would be flagged based on the presence of a `KEYCLOAK_BACKCHANNEL_BASE_URL`
- Switch all backend code that receives a user id and password to authenticate via Keycloak. Note still keep the existing session management code once the user is authenticated
- Give the option to sign-in via the Keycloak login form by adding a `keycloak=1` query parameter
- Move all users to automatically log-in via Keycloak
- Switch user registration to Keycloak, so PO will no longer be creating users or updating user profile information. Before we can do this we need to have completed the following:
    - Change the Pro user sign-up flow. Rather than putting the requested organization on the main user form the user would sign up normally and then request to join an organization once signed in. A regular welcome email would not be sent if the user signed up via the Pro platform. This can be started before any of the other Keycloak work
    - Trigger registration emails and user deletion through Redis events coming from Keycloak. This should only affect new users so probably don't need a feature flag. Will require implementing the Redis listener and Minion in all flavours

Note the existing branch includes support for API authentication using a Keycloak access token. Suggest this is pushed beyond the first release.

## Mobile

We will need to update the mobile application to launch the keycloak login and account pages before we can deprecate the password grant type option.

## Client Credentials for APIs

API consumers will need to be set up as Clients in Keycloak. Need to figure out how the sign-up process will work.

## Support Alternative Login

Once all apps are going through Keycloak for authentication we can start to support things like Social Login and Passkeys.
