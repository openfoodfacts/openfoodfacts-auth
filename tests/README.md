# End to End Tests

Playwright is used for end to end testing. NodeJS and NPM are required to run tests locally.

We recommend using the "Playwright Test for VSCode" plugin.

`make init` will install the required NPM packages and any Playwright dependencies for the current version (sudo privileges may be required).

`make test_setup` needs to be run at least once on the local Keycloak realm to configure a test client.

# Test Client

A very simple test client application is hosted in the `tests/client` folder and hosted in a test_client container as part of the development docker setup.
