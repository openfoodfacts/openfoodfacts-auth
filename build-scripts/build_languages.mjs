import { writeFileSync, readFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { getLanguages, languageFallbacks, normalizeLanguageCode } from './utils.mjs';

const themeDir = 'theme/off/common';

const countries = JSON.parse(readFileSync('build-scripts/countries.json'));

const {languages, languageList} = getLanguages();
// Add dummy language for testing
languageList.xx = 'xx';

const languageMessages =  '\n# The following are obtained from the OFF languages taxonomy\n' +
    Object.entries(languageList).map(([key,value]) => `locale_${key}=${value}`).sort().join('\n');

mkdirSync(`${themeDir}/messages`, {recursive: true});
for (const [ key, language ] of Object.entries(languages)) {
    if (key === 'en:unknown-language') continue;

    const code = normalizeLanguageCode(language.language_code_2?.en);
    if (!code) continue;
    // A regional variant has no names of its own: it reads its base language's, then English
    const nameLanguages = [ ...languageFallbacks(code), 'en' ];
    const countryMessages = [];
    for (const [countryId, country ] of Object.entries(countries)) {
        if (!country.country_code_2?.en) {
            continue;
        }
        const countryCode = country.country_code_2.en.toLowerCase();
        const localizedName = nameLanguages.map((l) => country.name[l]).find((name) => name);
        const countryName = (localizedName ?? country.name.en).replaceAll("'","''");
        countryMessages.push(`country_${countryCode}=${countryName}`);
    }
    // A variant without a catalog of its own uses the one of its base language
    const customMessageFile = languageFallbacks(code)
        .map((l) => `src/messages/messages_${l}.properties`)
        .find((file) => existsSync(file));
    const customMessages = customMessageFile ? readFileSync(customMessageFile, 'utf-8').split('\n') : [];
    writeFileSync(`${themeDir}/messages/messages_${code}.properties`,
        customMessages.join('\n') +
        '\n# The following are obtained from the OFF countries taxonomy\n' +
        countryMessages.sort().join('\n') + languageMessages);
}

// Add dummy language to show property names
copyFileSync('build-scripts/messages_xx.properties', `${themeDir}/messages/messages_xx.properties`);
