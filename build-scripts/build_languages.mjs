import { writeFileSync, appendFileSync, readFileSync, existsSync, mkdirSync } from 'fs';

const runtimeDir = 'runtime-scripts';
const themeDir = 'theme/off/common';


fetch('https://static.openfoodfacts.org/data/taxonomies/languages.json').then(async (response) => {
    const languages = await response.json();
    const countries = await (await fetch('https://static.openfoodfacts.org/data/taxonomies/countries.json')).json();

    const languageList = {};
    for (const [ key, language ] of Object.entries(languages)) {
        if (key === 'en:unknown-language') continue;

        const code = language.language_code_2.en;
        const name = (language.name?.[code] ?? language.name.en ?? key).replaceAll("'","''");
        languageList[code] = name;
    }
    const languageMessages =  '\n# The following are obtained from the OFF languages taxonomy\n' + 
        Object.entries(languageList).map(([key,value]) => `locale_${key}=${value}`).sort().join('\n');

    mkdirSync(`${themeDir}/messages`, {recursive: true});
    for (const [ key, language ] of Object.entries(languages)) {
        if (key === 'en:unknown-language') continue;

        const code = language.language_code_2.en;
        const countryMessages = [];
        for (const [countryId, country ] of Object.entries(countries)) {
            if (!country.country_code_2?.en) {
                continue;
            }
            const countryCode = country.country_code_2.en;
            const countryName = (country.name[code] ?? country.name.en).replaceAll("'","''");
            countryMessages.push(`country_${countryCode}=${countryName}`);
        }
        const customMessageFile = `src/messages/messages_${code}.properties`;
        const customMessages = existsSync(customMessageFile) ? readFileSync(customMessageFile, 'utf-8').split('/n') : [];
        writeFileSync(`${themeDir}/messages/messages_${code}.properties`, 
            customMessages.join('/n') +
            '\n# The following are obtained from the OFF countries taxonomy\n' + 
            countryMessages.sort().join('\n') + languageMessages);
    }
    const countryOptions = {};
    const countryList = {};
    // Try and sort the country list to avoid excess diffs
    for (const [ countryId, country ] of Object.entries(countries).sort((a,b) => a[0].localeCompare(b[0]))) {
        if (!country.country_code_2?.en) {
            console.warn(countryId);
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