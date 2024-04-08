import { writeFileSync, readFileSync, existsSync, readdirSync } from 'fs';

const baseThemeDir = 'theme';
const offThemeDir = `${baseThemeDir}/off`;

const allMessages = {login: {
    enMessages: [],
    keycloakMessages: {}
}};
const allThemeTypes = ['login', 'account', 'admin', 'email'];
const sourceThemes = ['base','keycloak', 'keycloak.v2'];

for (const [themeType, messages] of Object.entries(allMessages)) {
    const sourceFile = `${offThemeDir}/${themeType}/messages/messages_en.properties`;
    messages.enMessages.push(...readFileSync(sourceFile, 'utf-8').split('\n'));
    for (const theme of sourceThemes) {
        function addKeycloakMessages(keycloakThemeType) {
            const messagesDir = `${baseThemeDir}/${theme}/${keycloakThemeType}/messages`;
            if (!existsSync(messagesDir)) return;
            const messageFiles = readdirSync(messagesDir);
            for (const messageFile of messageFiles) {
                const twoLetterIndex = messageFile.indexOf('messages_') + 9;
                const twoLetterCode = messageFile.substring(twoLetterIndex, twoLetterIndex + 2);
                if (!messages.keycloakMessages[twoLetterCode])
                    messages.keycloakMessages[twoLetterCode] = [];
                messages.keycloakMessages[twoLetterCode].push(...readFileSync(`${messagesDir}/${messageFile}`, 'utf-8').split('\n'));
            }
        }
        addKeycloakMessages(themeType);
        // Add in translations from other themes in case they are available
        for (const otherTheme of allThemeTypes) {
            if (otherTheme !== themeType) addKeycloakMessages(otherTheme);
        }

        // Add in translations for messages we are using
        for (const [code, keycloakMessages] of Object.entries(messages.keycloakMessages)) {
            if (code === 'en') continue;
            const existingMessageFile = `${offThemeDir}/${themeType}/messages/messages_${code}.properties`;
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
    }
}
