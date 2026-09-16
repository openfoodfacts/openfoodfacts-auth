import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    baseLanguage,
    getLanguages,
    inheritedMessageFile,
    isBundleSupported,
    keycloakTranslationsFor,
    languageFallbacks,
    languageTag,
    messageFileLanguageCode,
    normalizeLanguageCode,
} from './utils.mjs';

test('a language code is normalized to the spelling Keycloak uses for its bundles', () => {
    assert.equal(normalizeLanguageCode('pt'), 'pt');
    assert.equal(normalizeLanguageCode('pt-br'), 'pt_BR');
    assert.equal(normalizeLanguageCode('PT_br'), 'pt_BR');
    assert.equal(normalizeLanguageCode('zh-hant-tw'), 'zh_Hant_TW');
    assert.equal(normalizeLanguageCode('en-gb'), 'en_GB');
    assert.equal(normalizeLanguageCode('es-419'), 'es_419');
    assert.equal(normalizeLanguageCode('sco'), 'sco');
});

test('an unsupported code is rejected rather than guessed', () => {
    assert.equal(normalizeLanguageCode('not a code'), undefined);
    assert.equal(normalizeLanguageCode(''), undefined);
    assert.equal(normalizeLanguageCode(undefined), undefined);
});

test('Keycloak parses a locale as a BCP-47 tag, with a hyphen, whatever the bundle is named', () => {
    assert.equal(languageTag('pt_BR'), 'pt-BR');
    assert.equal(languageTag('pt-br'), 'pt-BR');
    assert.equal(languageTag('zh_Hant_TW'), 'zh-Hant-TW');
    assert.equal(languageTag('pt'), 'pt');
    assert.equal(languageTag('xx'), 'xx');
    assert.equal(languageTag('not a code'), undefined);
});

test('the base language drops the script and the region', () => {
    assert.equal(baseLanguage('pt_BR'), 'pt');
    assert.equal(baseLanguage('zh-hant-tw'), 'zh');
    assert.equal(baseLanguage('pt'), 'pt');
});

test('the fallbacks go from the most specific to the least', () => {
    assert.deepEqual(languageFallbacks('zh_Hant_TW'), ['zh_Hant_TW', 'zh_Hant', 'zh']);
    assert.deepEqual(languageFallbacks('pt-BR'), ['pt_BR', 'pt']);
    assert.deepEqual(languageFallbacks('pt'), ['pt']);
    assert.deepEqual(languageFallbacks('not a code'), []);
});

test('a bundle file name gives the whole code, not its first two letters', () => {
    assert.equal(messageFileLanguageCode('messages_pt.properties'), 'pt');
    assert.equal(messageFileLanguageCode('messages_pt_BR.properties'), 'pt_BR');
    assert.equal(messageFileLanguageCode('messages_zh_Hans.properties'), 'zh_Hans');
    assert.equal(messageFileLanguageCode('messages_xx.properties'), 'xx');
    assert.equal(messageFileLanguageCode('README.md'), undefined);
});

test('a bundle reads the Keycloak bundles of its code, of its parents and of their aliases', () => {
    const keycloak = {
        pt: ['greeting=Olá', 'farewell=Adeus'],
        pt_BR: ['greeting=Oi'],
        zh_Hans: ['greeting=你好'],
        zh_Hant: ['greeting=您好'],
    };
    // Keycloak has no zh bundle: zh reads zh_Hans, as the old two letter key had it
    assert.deepEqual(keycloakTranslationsFor('zh', keycloak), ['greeting=你好']);
    // A script of its own comes before the alias of its base language
    assert.deepEqual(keycloakTranslationsFor('zh_Hant_TW', keycloak), ['greeting=您好', 'greeting=你好']);
    // A bundle its base language's alias points back at is read once, not twice
    assert.deepEqual(keycloakTranslationsFor('zh_Hans', keycloak), ['greeting=你好']);
    // A variant reads its own translations before its base language's
    assert.deepEqual(keycloakTranslationsFor('pt_BR', keycloak), ['greeting=Oi', 'greeting=Olá', 'farewell=Adeus']);
    assert.deepEqual(keycloakTranslationsFor('pt', keycloak), ['greeting=Olá', 'farewell=Adeus']);
    // Keycloak has nothing for these
    assert.deepEqual(keycloakTranslationsFor('sat', keycloak), []);
    assert.deepEqual(keycloakTranslationsFor('not a code', keycloak), []);
});

test('a bundle is deleted only when the taxonomy can say its language is unsupported', () => {
    const supported = ['en', 'pt', 'zh'];
    // A two letter language is what the taxonomy lists, so it decides
    assert.equal(isBundleSupported('pt', supported), true);
    assert.equal(isBundleSupported('qq', supported), false);
    // A variant follows its base language
    assert.equal(isBundleSupported('pt_BR', supported), true);
    assert.equal(isBundleSupported('zh_Hant_TW', supported), true);
    assert.equal(isBundleSupported('qq_BR', supported), false);
    // A three letter language has no ISO 639-1 code and so no taxonomy entry to be missing from
    assert.equal(isBundleSupported('sat', supported), true);
    assert.equal(isBundleSupported('sco', supported), true);
    // The spelling of the file name does not decide, the language does
    assert.equal(isBundleSupported('PT', supported), true);
    assert.equal(isBundleSupported('pt-BR', supported), true);
    assert.equal(isBundleSupported('QQ', supported), false);
    assert.equal(isBundleSupported('not a code', supported), false);
});

test('the Santali bundle Crowdin writes survives the committed taxonomy', () => {
    const supported = Object.keys(getLanguages().languageList);
    assert.ok(!supported.includes('sat'), 'the taxonomy is expected to have no entry for sat');
    assert.equal(isBundleSupported(messageFileLanguageCode('messages_sat.properties'), supported), true);
    assert.equal(isBundleSupported(messageFileLanguageCode('messages_qq.properties'), supported), false);
});

test('a variant inherits the nearest catalog, and a base language inherits none', () => {
    const present = [ 'src/messages/messages_pt.properties', 'src/messages/messages_zh_Hant.properties' ];
    const exists = (file) => present.includes(file);
    // A variant reads its base language's catalog rather than being seeded from English,
    // which would fill every key and leave no room for a Keycloak translation
    assert.equal(inheritedMessageFile('pt_BR', exists), 'src/messages/messages_pt.properties');
    // The nearest ancestor wins
    assert.equal(inheritedMessageFile('zh_Hant_TW', exists), 'src/messages/messages_zh_Hant.properties');
    // A base language inherits nothing: English is its fallback, applied elsewhere
    assert.equal(inheritedMessageFile('pt', exists), undefined);
    // Nor does a variant whose ancestors have no catalog
    assert.equal(inheritedMessageFile('fr_CA', exists), undefined);
    assert.equal(inheritedMessageFile('not a code', exists), undefined);
});

test('a taxonomy code is normalized and named from its parents, not read raw', () => {
    const {languageList} = getLanguages({
        'en:unknown-language': { language_code_2: { en: 'xx' }, name: { en: 'Unknown' } },
        'en:brazilian-portuguese': { language_code_2: { en: 'PT-br' }, name: { en: 'Brazilian Portuguese', pt: 'Português do Brasil' } },
        'en:scots': { language_code_2: { en: 'sco' }, name: { en: 'Scots', sco: 'Scots leid' } },
        'en:nameless': { language_code_2: { en: 'nl' } },
        'en:codeless': { name: { en: 'No code' } },
    });
    assert.deepEqual(languageList, {
        pt_BR: 'Português do Brasil',
        sco: 'Scots leid',
        nl: 'en:nameless',
    });
});

test('the languages taxonomy still gives one name per language, with no collision', () => {
    const {languageList} = getLanguages();
    const codes = Object.keys(languageList);
    assert.ok(codes.length > 150, `expected the full language list, got ${codes.length}`);
    assert.equal(codes.length, new Set(codes.map((code) => code.toLowerCase())).size);
    for (const code of codes) {
        assert.equal(code, normalizeLanguageCode(code), `${code} is not in its canonical spelling`);
        assert.ok(languageList[code], `${code} has no name`);
    }
    assert.equal(languageList.pt, 'Português');
});
