# Running Keycloak standalne

First, run `make build` to create the realm.json file with variables substituted. It seems that the standalone import for keycloak does not interpolate variables https://github.com/keycloak/keycloak/issues/12069

Then use `docker compose up -d --build` to build and run the container.

To see how a user logs in you can navigate to: http://localhost:5600/realms/open-products-facts/account/#/

# Major Workstreams

## User Migration

This is mostly taken care of. The scrypt has provider ensures users will not need to change their passwords. [README.md](src/README.md)

## Secrity

[ ] Figure out how applications can register a client_id and get a client_secret
[ ] Work out how to limit access to the management console
[ ] Make sure any tools that can export users are disabled

## Theming

Need to decide how similar we want to make the screens to the main pages. Some issues to consider:

 - How the locale is shown and passed through
 - Displaying current banners, e.g. donation prompts
 - General headers and footers

It looks like the CSS classes are very specific and so I suspect these could change with Keycloak releases. We therefore probably want a robust set of tests to ensure that themes are being applied correctly.

Currently the common.css file has to be copied between theme pages (account, login, etc.). Tried using a symlink but this didn't work.

## Localizaiton

We will need to ensure that all of the current OFF locales are covered with suitable translations.

Note that the default account theme, keycloak.v3, doesn't support localization properly. This is [fixed](https://github.com/keycloak/keycloak/issues/22507) but won't be available until verison 24.0.0. Still using keycloack.v3 for now though as it supports declarative user properties without having to build a custom UI.

[ ] Setup Crowdin yaml and GitHub actions
[ ] Ensure language parameter is passed to Keycloak and back to calling app

## Fields

All of the user editable fields need to be available on the account UI with any necessary validation

## Mobile

Presumably mobile will need to be updated to launch the keycloak login page, as there won't be a login API that can be used.

