/**
 * This utility will add existing keycloak translations, if available
 * when new localized keywords are added to the messages_en.properties file
 * Any existing translations are not overwritten
 */ 

import { writeFileSync, readFileSync, existsSync, readdirSync } from 'fs';
import { getLanguages } from './utils.mjs';

const baseThemeDir = 'theme';
const offMessagesDir = `src/messages`;

const enMessages = [];
const allKeycloakMessages = {};
const themeTypes = ['login', 'account', 'admin', 'email'];
const sourceThemes = ['base', 'keycloak', 'keycloak.v2', 'keycloak.v3'];

const sourceFile = `${offMessagesDir}/messages_en.properties`;
enMessages.push(...readFileSync(sourceFile, 'utf-8').split('\n'));
for (const theme of sourceThemes) {
    for (const keycloakThemeType of themeTypes) {
        const messagesDir = `${baseThemeDir}/${theme}/${keycloakThemeType}/messages`;
        if (!existsSync(messagesDir)) continue;
        const messageFiles = readdirSync(messagesDir);
        for (const messageFile of messageFiles) {
            const twoLetterIndex = messageFile.indexOf('messages_') + 9;
            const twoLetterCode = messageFile.substring(twoLetterIndex, twoLetterIndex + 2);
            if (!allKeycloakMessages[twoLetterCode])
                allKeycloakMessages[twoLetterCode] = [];
            allKeycloakMessages[twoLetterCode].push(...readFileSync(`${messagesDir}/${messageFile}`, 'utf-8').split('\n'));
        }
    }
}

// Add in translations for messages we are using
for (const [code, keycloakMessages] of Object.entries(allKeycloakMessages)) {
    if (code === 'en') continue;
    const existingMessageFile = `${offMessagesDir}/messages_${code}.properties`;
    const existingMessages = existsSync(existingMessageFile) ? readFileSync(existingMessageFile, 'utf-8').split('\n') : [];
    for (const enMessage of enMessages) {
        const messageKey = enMessage.split('=')[0];
        if (!messageKey.length) continue;
        const messageSearch = `${messageKey}=`;
        if (existingMessages.find(m => m.startsWith(messageSearch))) continue;

        const keycloakTranslation = keycloakMessages.find(m => m.startsWith(messageSearch));
        // TODO replace ([^'])'([^']) with $1''$2
        if (keycloakTranslation) existingMessages.push(keycloakTranslation);
    }
    writeFileSync(existingMessageFile, existingMessages.join('\n'));
}

// Create a test message file that includes all keycloak messages marked with * if we haven't listed them
const xxMessages = ['# The following are used for translation test purposes',
    '# If items surrounded by ** appear in the UI then we need to add that property into the',
    '# messages_en file so that translations can be done in Crowdin'];

// First add all the messages we've identified
for (const message of enMessages) {
    const parts = message.split('=');
    xxMessages.push(parts.length > 1 ? `${parts[0]}=[${parts[0]}]` : message);
}

// Then add any keycloak ones that we don't already list
xxMessages.push("# The following Keycloak messages won't be picked up by Crowdin");
for (const message of allKeycloakMessages.en) {
    const parts = message.split('=');
    if (parts.length < 2) continue;
    const messageSearch = `${parts[0]}=`;
    if (!enMessages.find(m => m.startsWith(messageSearch))) xxMessages.push(`${parts[0]}=[*${parts[0]}*]`);
}

writeFileSync('build-scripts/messages_xx.properties', xxMessages.join('\n'));

fetch('https://static.openfoodfacts.org/data/taxonomies/languages.json').then(async (response) => {
    writeFileSync('build-scripts/languages.json', await response.text());
    writeFileSync('build-scripts/countries.json', await (await fetch('https://static.openfoodfacts.org/data/taxonomies/countries.json')).text());

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
        const countryCode = country.country_code_2.en;
        // Currently get english name for sorting until Keycloak fixes sorting by localized name
        const countryName = country.name.en;
        countryOptions[countryCode] = '${country_' + countryCode + '}';
        countryList[countryCode] = countryName;
    }
    
    // Currently sort countries by english name until keycloak supports sorting by localized name
    const sortedCountryCodes = Object.entries(countryList).sort((a,b) => a[1].localeCompare(b[1])).map((entry) => entry[0]);
    const sortedLanguageCodes = Object.entries(languageList).sort((a,b) => a[1].localeCompare(b[1])).map((entry) => entry[0]);
    
    // Add dummy language to show property names
    sortedLanguageCodes.push('xx');
    
    const realmSettings = {
        supportedLocales: sortedLanguageCodes
    }
    writeFileSync(`runtime-scripts/realm_settings.json`,JSON.stringify(realmSettings, undefined, 2));
    writeFileSync(`${themeDir}/theme.properties`,`locales=${sortedLanguageCodes.join(',')}\n`);
    
    const userProfile = JSON.parse(readFileSync(`${runtimeDir}/users_profile.json`));
    const countryAttribute = userProfile.attributes.find((a) => a.name === 'country');
    countryAttribute.validations.options.options = sortedCountryCodes;
    countryAttribute.annotations.inputOptionLabels = countryOptions;
    writeFileSync(`${runtimeDir}/users_profile.json`, JSON.stringify(userProfile, undefined, 2));
});