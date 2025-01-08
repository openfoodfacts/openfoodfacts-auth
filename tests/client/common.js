const urlParams = new URLSearchParams(window.location.search);

export const clientId = urlParams.get('clientId');
export const clientSecret = urlParams.get('clientSecret');
export const lang = urlParams.get('lang');
export const keycloak = decodeURIComponent(urlParams.get('keycloak'));
export const code = urlParams.get("code");
export const error = urlParams.get("error");

export function login() {
    const nonce = crypto.getRandomValues(new BigUint64Array(1))[0];
    const url = `${keycloak}/protocol/openid-connect/auth?response_type=code&client_id=${clientId}&redirect_uri=${
        encodeURIComponent(`http://localhost:5604/code.html?clientId=${clientId}&clientSecret=${clientSecret}&lang=${lang}&keycloak=${encodeURIComponent(keycloak)}`)
    }&scope=openid+profile+offline_access&state=${nonce}&ui_locales=${lang}`;
    window.location = url;
}
