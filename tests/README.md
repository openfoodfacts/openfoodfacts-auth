# End to End Tests

Playwright is used for end to end testing. NodeJS and NPM are required to run tests locally.

We recommend using the "Playwright Test for VSCode" plugin.

`make init` will install the required NPM packages and any Playwright dependencies for the current version (sudo privileges may be required).

`make test_setup` needs to be run at least once on the local Keycloak realm to configure a test client.

# Test Client

A very simple test client application is hosted in the `tests/client` folder and hosted in a test_client container as part of the development docker setup.

# Screenshot Tests

The `screenshots.spec.ts` module captures full screen shots to check for UI changes between builds, e.g. after Keycloak upgrades. To re-create a snapshot simply delete the `png` file and re-run the test.

Note that you need to disable the `Show browser` option if running these tests interactively in VSCode as it will render the images differently.
