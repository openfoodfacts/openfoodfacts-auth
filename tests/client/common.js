const urlParams = new URLSearchParams(window.location.search);

export const clientId = 'test_client';
export const pkceClientId = 'test_public_client';
export const clientSecret = 'test-client-secret';
export const lang = urlParams.get("lang");
export const keycloak = 'http://auth.openfoodfacts.localhost:5606/realms/openfoodfacts';
export const code = urlParams.get("code");
export const error = urlParams.get("error");
export const mode = urlParams.get("mode");

export function redirectUri(pkce = false, page = "code") {
  return `http://localhost:5604/${page}.html?lang=${lang}&mode=${pkce ? "pkce" : "auth"}`;
}
export function login() {
  const nonce = crypto.getRandomValues(new BigUint64Array(1))[0];
  const url = `${keycloak}/protocol/openid-connect/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri()
  )}&scope=openid+profile+offline_access&state=${nonce}&ui_locales=${lang}`;
  window.location = url;
}

function base64URLEncode(bytes) {
  const b64 = btoa(String.fromCodePoint(...bytes));
  const encoded = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return encoded;
}

export async function pkceLogin() {
  const verifier = base64URLEncode(crypto.getRandomValues(new Uint8Array(32)));
  // Save the verifier so that the code page can access it
  // Should really use sessionStorage but for tests when we click a verification email that starts a separate session
  localStorage.setItem("verifier", verifier);
  const codeChallenge = base64URLEncode(
    new Uint8Array(
      await crypto.subtle.digest(
        { name: "SHA-256" },
        new TextEncoder().encode(verifier)
      )
    )
  );

  const nonce = crypto.getRandomValues(new BigUint64Array(1))[0];
  const url = `${keycloak}/protocol/openid-connect/auth?response_type=code&client_id=${pkceClientId}&redirect_uri=${encodeURIComponent(
    redirectUri(true)
  )}&scope=openid+profile+offline_access&state=${nonce}&ui_locales=${lang}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  window.location = url;
}
