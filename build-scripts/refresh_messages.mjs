/**
 * This utility will add existing keycloak translations, if available
 * when new localized keywords are added to the messages_en.properties file
 * Any existing translations are not overwritten
 */ 

import { writeFileSync, readFileSync, existsSync, readdirSync, copyFileSync, rmSync } from 'fs';
import { getLanguages, isBundleSupported, languageFallbacks, messageFileLanguageCode } from './utils.mjs';
import stringify from 'json-stable-stringify';

const baseThemeDir = 'theme/theme';
const offMessagesDir = `src/messages`;

const enMessages = [];
const allKeycloakMessages = {};
const themeTypes = ['login', 'account', 'admin', 'email'];
const sourceThemes = ['base', 'keycloak', 'keycloak.v2', 'keycloak.v3'];

// Get the current "en" message strings, i.e. the ones we are using
const sourceFile = `${offMessagesDir}/messages_en.properties`;
enMessages.push(...readFileSync(sourceFile, 'utf-8').split('\n'));

// Get all current keycloak translations
for (const theme of sourceThemes) {
    for (const keycloakThemeType of themeTypes) {
        const messagesDir = `${baseThemeDir}/${theme}/${keycloakThemeType}/messages`;
        if (!existsSync(messagesDir)) continue;
        const messageFiles = readdirSync(messagesDir);
        for (const messageFile of messageFiles) {
            // Keycloak ships bundles for variants too, such as messages_pt_BR.properties and
            // messages_zh_Hans.properties: they are kept under their own code instead of being
            // merged into the base language's
            const code = messageFileLanguageCode(messageFile);
            if (!code) continue;
            if (!allKeycloakMessages[code])
                allKeycloakMessages[code] = [];
            allKeycloakMessages[code].push(...readFileSync(`${messagesDir}/${messageFile}`, 'utf-8').split('\n'));
        }
    }
}

// Get the languages and countries taxonomies
fetch('https://static.openfoodfacts.org/data/taxonomies/languages.json').then(async (response) => {
    writeFileSync('build-scripts/languages.json', stringify(await response.json(), {space: 2}));
    writeFileSync('build-scripts/countries.json', stringify(await (await fetch('https://static.openfoodfacts.org/data/taxonomies/countries.json')).json(), {space: 2}));

    const runtimeDir = 'runtime-scripts';
    const themeDir = 'theme/off/common';
    
    const {languageList} = getLanguages();
    const countries = JSON.parse(readFileSync('build-scripts/countries.json'));
    
    const countryOptions = {};
    const countryList = {};
    // Try and sort the country list to avoid excess diffs
    for (const [ countryId, country ] of Object.entries(countries).sort((a,b) => a[0].localeCompare(b[0]))) {
        if (!country.country_code_2?.en) {
            console.warn(`No 2 letter code for: ${countryId}`);
            continue;
        }
        const countryCode = country.country_code_2.en.toLowerCase();
        // Currently get english name for sorting until Keycloak fixes sorting by localized name
        const countryName = country.name.en;
        countryOptions[countryCode] = '${country_' + countryCode + '}';
        countryList[countryCode] = countryName;
    }
    
    // Currently sort countries by english name until keycloak supports sorting by localized name
    const sortedCountryCodes = Object.entries(countryList).sort((a,b) => a[1].localeCompare(b[1])).map((entry) => entry[0]);
    const sortedLanguageCodes = Object.entries(languageList).sort((a,b) => a[1].localeCompare(b[1])).map((entry) => entry[0]);
    
    // Check we have a messages file for every language we support
    for (const code of sortedLanguageCodes) {
        const messageFile = `${offMessagesDir}/messages_${code}.properties`;
        if (!existsSync(messageFile)) {
            // Copy file from en
            copyFileSync(sourceFile, messageFile);
        }
    }

    // Delete any message files for languages we don't support. isBundleSupported says what
    // the languages taxonomy can and cannot decide about a bundle: a variant or a three
    // letter language is never deleted on its word.
    for (const messageFile of readdirSync(offMessagesDir)) {
        const code = messageFileLanguageCode(messageFile);
        if (!code || isBundleSupported(code, sortedLanguageCodes)) continue;
        console.warn(`Deleted message file for unsupported language: ${messageFile}`);
        rmSync(`${offMessagesDir}/${messageFile}`);
    }

    // Add dummy language to show property names
    sortedLanguageCodes.push('xx');

    // Add the list of locales to the realm settings and theme template
    const realmSettings = JSON.parse(readFileSync(`${runtimeDir}/realm_settings_template.json`));
    realmSettings.supportedLocales = sortedLanguageCodes;
    writeFileSync(`${runtimeDir}/realm_settings_template.json`,stringify(realmSettings, {space: 2}));
    writeFileSync(`${themeDir}/theme.properties`,`locales=${sortedLanguageCodes.join(',')}\n`);

    // Add the list of countries to the custom user property pick list
    const userProfile = JSON.parse(readFileSync(`${runtimeDir}/users_profile.json`));
    const countryAttribute = userProfile.attributes.find((a) => a.name === 'country');
    countryAttribute.validations.options.options = sortedCountryCodes;
    countryAttribute.annotations.inputOptionLabels = countryOptions;
    writeFileSync(`${runtimeDir}/users_profile.json`, stringify(userProfile, {space: 2}));

    // Add in translations from Keycloak for messages we are using. The loop is over the
    // bundles we have, not over the ones Keycloak has, so a Keycloak locale we do not carry
    // no longer creates a file, and a variant of ours reads its base language's Keycloak
    // translations when Keycloak has none of its own.
    for (const messageFile of readdirSync(offMessagesDir)) {
        const code = messageFileLanguageCode(messageFile);
        if (!code || code === 'en') continue;
        const keycloakMessages = languageFallbacks(code).flatMap((l) => allKeycloakMessages[l] ?? []);
        if (!keycloakMessages.length) continue;
        const existingMessageFile = `${offMessagesDir}/${messageFile}`;
        const existingMessages = readFileSync(existingMessageFile, 'utf-8').split('\n');

        // Get rid of any blank line at the end (avoids unnecessary Crowdin diffs)
        const lastMessage = existingMessages.pop();
        if (lastMessage) existingMessages.push(lastMessage);

        for (const enMessage of enMessages) {
            const messageKey = enMessage.split('=')[0];
            if (!messageKey.length) continue;
            const messageSearch = `${messageKey}=`;
            if (existingMessages.find(m => m.startsWith(messageSearch))) continue;

            const keycloakTranslation = keycloakMessages.find(m => m.startsWith(messageSearch));
            // TODO replace ([^'])'([^']) with $1''$2
            if (keycloakTranslation) existingMessages.push(keycloakTranslation);
        }
        // Add blank line back on end to make Crowdin happy
        existingMessages.push('');

        writeFileSync(existingMessageFile, existingMessages.join('\n'));
    }

    // Create a test message file that includes all keycloak messages marked with * if we haven't listed them
    const xxMessages = ['# The following are used for translation test purposes',
        '# If items surrounded by ** appear in the UI then we need to add that property into the',
        '# messages_en file so that translations can be done in Crowdin'];

    const makeDummyValue = (parts) => {
        const placeholders = [];
        const value = parts.slice(1).join('=');
        let index = value.indexOf('{');
        while (index >= 0) {
            let endIndex = value.indexOf('}', index);
            // Sometime we get two sets of brackets
            if (value[endIndex + 1] === '}') endIndex++;
            const placeholder = value.slice(index, endIndex + 1);
            const label = placeholder.replace(/[\{\}]/g, '').split(',')[0]; // Get rid of brackets and don't include comma separated arguments
            placeholders.push(`${label}=${placeholder}`);
            index = value.indexOf('{', endIndex);
        }
        return parts[0] + (placeholders.length ? ' ' : '') + placeholders.sort().join(', ');
    }

    // First add all the messages we've identified
    for (const message of enMessages) {
        const parts = message.split('=');
        xxMessages.push(parts.length > 1 ? `${parts[0]}=^${makeDummyValue(parts)}^` : message);
    }

    // Then add any keycloak ones that we don't already list
    xxMessages.push("# The following Keycloak messages won't be picked up by Crowdin");
    for (const message of allKeycloakMessages.en) {
        const parts = message.split('=');
        if (parts.length < 2) continue;
        const messageSearch = `${parts[0]}=`;
        if (!enMessages.find(m => m.startsWith(messageSearch))) xxMessages.push(`${parts[0]}=*${makeDummyValue(parts)}*`);
    }

    writeFileSync('build-scripts/messages_xx.properties', xxMessages.join('\n'));


});