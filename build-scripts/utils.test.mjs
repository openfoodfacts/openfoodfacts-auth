import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    baseLanguage,
    getLanguages,
    languageFallbacks,
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
