import { readFileSync } from 'fs';

/**
 * A language code is a two or three letter language, optionally followed by a script and a
 * region: pt, sco, pt_BR, zh_Hant, zh_Hant_TW. Keycloak names its own message bundles the
 * same way (messages_pt_BR.properties, messages_zh_Hans.properties), so that spelling is
 * used throughout this repository. The BCP-47 form, pt-BR, only belongs on the wire, in
 * the OIDC ui_locales parameter, and is the caller's business.
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
