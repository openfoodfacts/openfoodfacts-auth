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
const adminUrl = `${keycloakUrl}/admin/realms/${realmName}`; 

// See if client exists
const existingClient = (await (await fetch(`${adminUrl}/clients?clientId=${testClientId}`, {headers})).json())[0];
const clientRepresentation = JSON.stringify({
  clientId: testClientId,
  name: "Test Client",
//  rootUrl: "http://localhost:5604",
  baseUrl: "http://localhost:5604/status",
  clientAuthenticatorType: "client-secret",
  secret: testClientSecret,
  redirectUris: ["http://localhost:5604/*"],
  webOrigins: ["+"],
  serviceAccountsEnabled: true,
  //   notBefore: 0,
//   bearerOnly: false,
//   consentRequired: false,
// standardFlowEnabled: true,
//   implicitFlowEnabled: false,
//   directAccessGrantsEnabled: true,
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
    await fetch(`${adminUrl}/clients/${existingClient.id}`, {method: 'PUT', body: clientRepresentation, headers});
} else {
    await fetch(`${adminUrl}/clients`, {method: 'POST', body: clientRepresentation, headers});
}

// Get the user
const userUrl = `${adminUrl}/users`;
const user = (await (await fetch(`${userUrl}?username=service-account-${testClientId}`, {headers})).json())[0];

// Get the id of the ream-management client
const realmManagementClient = (await (await fetch(`${adminUrl}/clients?clientId=realm-management`, {headers})).json())[0];

// Get the id of the manage-users role
const manageUsersRole = (await (await fetch(`${adminUrl}/clients/${realmManagementClient.id}/roles/manage-users`, {headers})).json());

// Add the role to the user
const roleMapping = [manageUsersRole];
await fetch(`${adminUrl}/users/${user.id}/role-mappings/clients/${realmManagementClient.id}`, {method: 'POST', body: JSON.stringify(roleMapping), headers});
