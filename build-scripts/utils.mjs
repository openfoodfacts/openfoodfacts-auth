import { readFileSync } from 'fs';

export function getLanguages() {
    const languages = JSON.parse(readFileSync('build-scripts/languages.json'));

    const languageList = {};
    for (const [ key, language ] of Object.entries(languages)) {
        if (key === 'en:unknown-language') continue;
    
        const code = language.language_code_2.en;
        const name = (language.name?.[code] ?? language.name.en ?? key).replaceAll("'","''");
        languageList[code] = name;
    }

    return {languages, languageList};
}
