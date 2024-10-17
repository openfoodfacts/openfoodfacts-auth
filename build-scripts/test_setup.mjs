const keycloakId = process.env.KEYCLOAK_ADMIN;
const keycloakPassword = process.env.KEYCLOAK_ADMIN_PASSWORD;
const keycloakUrl = process.env.KEYCLOAK_BASE_URL;
const realmName = process.env.KEYCLOAK_REALM_NAME;

const testClientId = process.env.TEST_CLIENT_ID;
const testClientSecret = process.env.TEST_CLIENT_SECRET;

const body = new URLSearchParams();
body.set('grant_type', 'password');
body.set('username', keycloakId);
body.set('password', keycloakPassword);
body.set('client_id', 'admin-cli');

const access_token = (await (await fetch(`${keycloakUrl}/realms/master/protocol/openid-connect/token`, {
    method: 'POST',
    body: body,
})).json()).access_token;

const headers = new Headers();
headers.set('Authorization', `Bearer ${access_token}`);

// See if client exists
const existingClient = (await (await fetch(`${keycloakUrl}/admin/realms/${realmName}/clients?clientId=${testClientId}`, {headers})).json())[0];

const clientRepresentation = JSON.stringify({
  clientId: testClientId,
  name: "Test Client",
//  rootUrl: "http://localhost:5604",
  baseUrl: "http://localhost:5604/status",
  clientAuthenticatorType: "client-secret",
  secret: testClientSecret,
  redirectUris: ["http://localhost:5604/*"],
  webOrigins: ["+"],
//   notBefore: 0,
//   bearerOnly: false,
//   consentRequired: false,
// standardFlowEnabled: true,
//   implicitFlowEnabled: false,
//   directAccessGrantsEnabled: true,
//   serviceAccountsEnabled: false,
//   publicClient: false,
//   frontchannelLogout: true,
//   protocol: "openid-connect",
//   attributes: {
//     "client.secret.creation.time": "1729000591",
//     "client.introspection.response.allow.jwt.claim.enabled": "false",
//     login_theme: "off",
//     "post.logout.redirect.uris": "http://localhost:5604/*",
//     "oauth2.device.authorization.grant.enabled": "false",
//     "backchannel.logout.revoke.offline.tokens": "false",
//     "use.refresh.tokens": "true",
//     realm_client: "false",
//     "oidc.ciba.grant.enabled": "false",
//     "client.use.lightweight.access.token.enabled": "false",
//     "backchannel.logout.session.required": "true",
//     "client_credentials.use_refresh_token": "false",
//     "acr.loa.map": "{}",
//     "require.pushed.authorization.requests": "false",
//     "tls.client.certificate.bound.access.tokens": "false",
//     "display.on.consent.screen": "false",
//     "token.response.type.bearer.lower-case": "false",
//   },
//   authenticationFlowBindingOverrides: {},
//   fullScopeAllowed: true,
//   nodeReRegistrationTimeout: -1,
//   defaultClientScopes: [
//     "web-origins",
//     "acr",
//     "profile",
//     "roles",
//     "basic",
//     "email",
//   ],
//   optionalClientScopes: [
//     "address",
//     "phone",
//     "offline_access",
//     "microprofile-jwt",
//   ],
//   access: {
//     view: true,
//     configure: true,
//     manage: true,
//   },
});

headers.set('Content-Type', 'application/json');
if (existingClient) {
    await fetch(`${keycloakUrl}/admin/realms/${realmName}/clients/${existingClient.id}`, {method: 'PUT', body: clientRepresentation, headers});
} else {
    await fetch(`${keycloakUrl}/admin/realms/${realmName}/clients`, {method: 'POST', body: clientRepresentation, headers});
}
