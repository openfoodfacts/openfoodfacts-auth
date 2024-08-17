# Themes

The OpenFoodFacts theme is in the off directory. The other directories are a copy of the default themes that come with Keycloak and are extracted here purely for reference.

To refresh the default Keycloak themes run `make refresh_themes`

Note that the messages in the theme/off/common/messages folder are refreshed automatically from the Open Food Facts language and country taxonomies and should not be manually edited.

Only the messages in the src/messages folder should be translated with Crowdin.

The basic theme templates are used wherever possible, but currently user-profile-commons.ftl is overridden to sort country codes correctly.

