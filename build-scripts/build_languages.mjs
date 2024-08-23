import { writeFileSync, readFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { getLanguages } from './utils.mjs';

const themeDir = 'theme/off/common';

const countries = JSON.parse(readFileSync('build-scripts/countries.json'));

const {languages, languageList} = getLanguages();
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

// Add dummy language to show property names
copyFileSync('build-scripts/messages_xx.properties', `${themeDir}/messages/messages_xx.properties`);
