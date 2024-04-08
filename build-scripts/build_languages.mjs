import { writeFileSync, appendFileSync, readFileSync } from 'fs';

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

        const countryMessages = [];
        for (const [countryId, country ] of Object.entries(countries)) {
            if (!country.country_code_2?.en) {
                continue;
            }
            const countryCode = country.country_code_2.en;
            const countryName = (country.name[code] ?? country.name.en).replaceAll("'","''");
            countryMessages.push(`country_${countryCode}=${countryName}`);
        }
        writeFileSync(`${themeDir}/messages/messages_${code}.properties`, countryMessages.sort().join('\n') + '\n');
    }

    const countryOptions = {};
    const countryList = {};
    for (const [ countryId, country ] of Object.entries(countries)) {
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

    const sortedLanguageCodes = Object.entries(languageList).sort((a,b) => a[1].localeCompare(b[1])).map((entry) => entry[0]);
    // Currently sort countries by english name until keycloak supports sorting by localized name
    const sortedCountryCodes = Object.entries(countryList).sort((a,b) => a[1].localeCompare(b[1])).map((entry) => entry[0]);
    const realmSettings = {
        supportedLocales: sortedLanguageCodes
    }
    writeFileSync(`runtime-scripts/realm_settings.json`,JSON.stringify(realmSettings));
    writeFileSync(`${themeDir}/theme.properties`,`locales=${sortedLanguageCodes.join(',')}\n`);
    appendFileSync(`${themeDir}/messages/messages_en.properties`,Object.entries(languageList).map(([key,value]) => `locale_${key}=${value}`).sort().join('\n') + '\n');

    const userProfile = JSON.parse(readFileSync(`${runtimeDir}/users_profile.json`));
    const countryAttribute = userProfile.attributes.find((a) => a.name === 'country');
    countryAttribute.validations.options.options = sortedCountryCodes;
    countryAttribute.annotations.inputOptionLabels = countryOptions;
    writeFileSync(`${runtimeDir}/users_profile.json`, JSON.stringify(userProfile));
    //writeFileSync(`${baseDir}/countries.json`, JSON.stringify(countryList, Object.keys(countryList).sort()));
    //writeFileSync(`${baseDir}/languages.json`, JSON.stringify(languageList, Object.keys(languageList).sort()));
});