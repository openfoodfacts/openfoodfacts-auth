# Localization

Messages are shared between the server (Java) and Themes.

Changes made to message files will be picked up by the Java code on build, but in order for them to be picked up by the Themes you need to run `make build_languages`.

For Themes an additional 'xx' locale is created which just shows the message id surrounded by '^' if an entry exists in the `messages_en` file, or '*' if no current `en` translation exists.

The presence of a label surrounded by '*' when using the 'xx' locale indicates that the message needs to be added to the `src/messages/messages_en.properties` file so that this can be picked up by Crowdin.

We can take advantage of existing Keycloak translations of any messages we use by running `make refresh_messages`.

Note that we explicitly list the messages that we use in our own `messages_en` rather than just using all existing Keycloak translations because Keycloak currently supports far fewer languages that Open Food Facts so we don't want to burden our Crowdin community with translating many messages that are never used.

## Languages and Countries

The translations from Languages and Countries are obtained from the Open Food Facts taxonomies, rather than Crowdin. These taxonomy JSON files are cached in the `build-scripts` folder. The files are refreshed from Product Opener when `make refresh_messages` is run.

### Languages

This list would always show each language in its own translation, e.g. "English, Français, 汉语".

The `build_languages` script reads the language.json and for each language uses the language_code_2 to look up the name. If no name is found in that language then the "en" translation will be used and if that cannot be found then the id of the entry will be used (with the "en:" prefix).

### Countries

The basic list defined in `runtime-scripts/user_profiles.json` simply consist of placeholders for all the entries which will link to translations in a message file.

The `build_languages` script creates a message file for each known language and adds all countries to that.

