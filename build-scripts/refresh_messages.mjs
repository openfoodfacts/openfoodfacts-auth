import { writeFileSync, readFileSync, existsSync, readdirSync } from 'fs';

const baseThemeDir = 'theme';
const offMessagesDir = `${baseThemeDir}/off/common/messages`;

const messages = [];
const allKeycloakMessages = {};
const themeTypes = ['login', 'account', 'admin', 'email'];
const sourceThemes = ['base', 'keycloak', 'keycloak.v2'];

const sourceFile = `${offMessagesDir}/messages_en.properties`;
messages.enMessages.push(...readFileSync(sourceFile, 'utf-8').split('\n'));
for (const theme of sourceThemes) {
    for (const keycloakThemeType of themeTypes) {
        const messagesDir = `${baseThemeDir}/${theme}/${keycloakThemeType}/messages`;
        if (!existsSync(messagesDir)) return;
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
    for (const enMessage of messages.enMessages) {
        const messageKey = enMessage.split('=')[0];
        if (!messageKey.length) continue;
        const messageSearch = `${messageKey}=`;
        if (existingMessages.find(m => m.startsWith(messageSearch))) continue;

        const keycloakTranslation = keycloakMessages.find(m => m.startsWith(messageSearch));
        if (keycloakTranslation) existingMessages.push(keycloakTranslation);
    }
    writeFileSync(existingMessageFile, existingMessages.join('\n'));
}
