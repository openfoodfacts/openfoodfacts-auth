import { readFileSync } from 'fs';

/**
 * A language code is a two or three letter language, optionally followed by a script and a
 * region: pt, sco, pt_BR, zh_Hant, zh_Hant_TW.
 *
 * Keycloak spells such a code two ways, and so does this repository. A bundle file name
 * takes the underscore, messages_pt_BR.properties: that is java.util.Locale#toString, and
 * how Keycloak names its own bundles. It is the spelling used internally here, so that a
 * code and the file it names agree. Everything Keycloak parses as a locale is a BCP-47 tag
 * with a hyphen, pt-BR: the realm's supportedLocales, the locales= line of
 * theme.properties, the locale_ label keys in the bundles and the OIDC ui_locales
 * parameter. Locale.forLanguageTag("pt_BR") is the empty locale, so the underscore must
 * not reach any of those; languageTag gives the tag for a code.
 */
const languageCodePattern = /^[a-z]{2,3}(?:[-_][a-z]{4})?(?:[-_](?:[a-z]{2}|[0-9]{3}))?$/i;

/**
 * The canonical spelling of a language code, or undefined when the syntax is not supported.
 * Hyphens, underscores and mixed case are accepted: pt-br and PT_br both give pt_BR.
 * This says nothing about whether the language exists or is enabled anywhere.
 */
export function normalizeLanguageCode(code) {
    if (!code || !languageCodePattern.test(code)) return undefined;
    const [ language, ...subtags ] = code.split(/[-_]/);
    const normalizedSubtags = subtags.map((subtag) => subtag.length === 4
        ? subtag[0].toUpperCase() + subtag.slice(1).toLowerCase()
        : subtag.toUpperCase());
    return [ language.toLowerCase(), ...normalizedSubtags ].join('_');
}

/**
 * The BCP-47 tag for a code, the spelling Keycloak parses: pt_BR gives pt-BR. Only a bundle
 * file name keeps the underscore.
 */
export function languageTag(code) {
    const normalized = normalizeLanguageCode(code);
    return normalized ? normalized.replaceAll('_', '-') : undefined;
}

/** The language without its script or region: pt_BR gives pt, zh_Hant_TW gives zh. */
export function baseLanguage(code) {
    const normalized = normalizeLanguageCode(code);
    return normalized ? normalized.split('_')[0] : undefined;
}

/**
 * The codes to try for a language, from the most specific to the least: zh_Hant_TW gives
 * zh_Hant_TW, zh_Hant, zh. A variant that has nothing of its own uses its base language.
 */
export function languageFallbacks(code) {
    const normalized = normalizeLanguageCode(code);
    if (!normalized) return [];
    const codes = [ normalized ];
    const subtags = normalized.split('_');
    while (subtags.length > 1) {
        subtags.pop();
        codes.push(subtags.join('_'));
    }
    return codes;
}

/**
 * Keycloak bundles read on behalf of a code Keycloak ships nothing under. Keycloak has no
 * messages_zh.properties, only zh_Hans and zh_Hant; our zh bundle, like the taxonomy's own
 * name for zh, is Simplified Chinese, so it reads zh_Hans, which is also what the old two
 * letter key gave it. Keys and values are codes in their canonical spelling.
 */
const keycloakAliases = {
    zh: 'zh_Hans',
};

/**
 * The Keycloak translations a bundle is seeded from, most specific first: the code's own,
 * then its parents', each followed by its alias when it has one. pt_BR reads pt_BR then
 * pt; zh reads zh_Hans; zh_Hant_TW reads zh_Hant_TW, zh_Hant, zh and only then zh_Hans. A
 * code Keycloak has nothing for gives an empty list. allKeycloakMessages maps a code to
 * the lines of Keycloak's bundles for it.
 */
export function keycloakTranslationsFor(code, allKeycloakMessages) {
    return languageFallbacks(code)
        .flatMap((l) => [ l, keycloakAliases[l] ].filter(Boolean))
        .flatMap((l) => allKeycloakMessages[l] ?? []);
}

/**
 * The language code a message bundle is for, from its file name, whatever its length:
 * messages_pt.properties gives pt and messages_pt_BR.properties gives pt_BR. Reading a
 * fixed number of characters would collapse a variant onto its base language.
 */
export function messageFileLanguageCode(fileName) {
    const match = /^messages_(.+)\.properties$/.exec(fileName);
    return match ? match[1] : undefined;
}

/**
 * Whether a message bundle is kept, given the codes of the languages taxonomy. The taxonomy
 * is the list of languages we support, but every one of its entries has an ISO 639-1 code,
 * so it can only speak for two letter languages, and a bundle it cannot describe is not one
 * it can condemn:
 *  - a regional or script variant, pt_BR or zh_Hant, is kept while its base language is
 *    supported. Which variants are enabled is not something the taxonomy can say.
 *  - a three letter language, sat or sco, has no ISO 639-1 code and so no entry at all.
 *    Crowdin writes such a bundle as soon as the language has one translation; deleting it
 *    here would only have Crowdin write it back on the next sync.
 * A two letter language the taxonomy does not list is one we no longer support, and its
 * bundle is stale. The spelling of the file name does not decide: messages_PT.properties is
 * the pt bundle, misnamed, and is kept, and messages_QQ.properties is stale all the same.
 */
export function isBundleSupported(code, supportedCodes) {
    const normalized = normalizeLanguageCode(code);
    if (!normalized) return false;
    const base = baseLanguage(normalized);
    if (base.length > 2) return true;
    return supportedCodes.includes(normalized) || supportedCodes.includes(base);
}

export function getLanguages() {
    const languages = JSON.parse(readFileSync('build-scripts/languages.json'));

    const languageList = {};
    for (const [ key, language ] of Object.entries(languages)) {
        if (key === 'en:unknown-language') continue;

        const code = normalizeLanguageCode(language.language_code_2?.en);
        if (!code) {
            console.warn(`No supported language code for: ${key}`);
            continue;
        }
        const ownName = languageFallbacks(code).map((l) => language.name?.[l]).find((name) => name);
        const name = (ownName ?? language.name?.en ?? key).replaceAll("'","''");
        languageList[code] = name;
    }

    return {languages, languageList};
}
