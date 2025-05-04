# Themes

The OpenFoodFacts theme is in the off directory. The `theme`sub-directory contains copies files from the the default themes that come with Keycloak that we override and are extracted here purely for reference.

You will need to update the `refresh_themes` target of the `Makefile` if you need to override any new templates.

To refresh the default Keycloak themes run `make refresh_themes`

Note that the messages in the theme/off/common/messages folder are refreshed automatically from the Open Food Facts language and country taxonomies and should not be manually edited.

Only the messages in the src/messages folder should be translated with Crowdin.

See the root [README](../README.md) for details of specific templates that have been overridden that need to be checked when applying Keycloak updates.

