/**
 * This utility will add existing keycloak translations, if available
 * when new localized keywords are added to the messages_en.properties file
 * Any existing translations are not overwritten
 */ 

import { writeFileSync, readFileSync, existsSync, readdirSync } from 'fs';

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
        if (keycloakTranslation) existingMessages.push(keycloakTranslation);
    }
    writeFileSync(existingMessageFile, existingMessages.join('\n'));
}
