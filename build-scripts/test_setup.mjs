const keycloakId = process.env.KC_BOOTSTRAP_ADMIN_USERNAME;
const keycloakPassword = process.env.KC_BOOTSTRAP_ADMIN_PASSWORD;
const keycloakUrl = process.env.KEYCLOAK_BASE_URL;
const realmName = process.env.KEYCLOAK_REALM_NAME;

const testClientId = process.env.TEST_CLIENT_ID;
const testClientSecret = process.env.TEST_CLIENT_SECRET;

const testPkceClientId = process.env.TEST_PKCE_CLIENT_ID;

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

async function createClient(clientId, clientSecret) {
  // See if client exists
  const existingClient = (await (await fetch(`${adminUrl}/clients?clientId=${clientId}`, {headers})).json())[0];

  const clientRepresentation = {
    clientId: clientId,
    name: "Test Client",
    baseUrl: "http://localhost:5604/status",
    clientAuthenticatorType: "client-secret",
    redirectUris: ["http://localhost:5604/*"],
    webOrigins: ["+"],
    serviceAccountsEnabled: true,
  };
  if (clientSecret) {
    clientRepresentation.secret = clientSecret;
  } else {
    clientRepresentation.publicClient = true;
  }
  const encodedClient = JSON.stringify(clientRepresentation);
  headers.set('Content-Type', 'application/json');
  if (existingClient) {
      await fetch(`${adminUrl}/clients/${existingClient.id}`, {method: 'PUT', body: encodedClient, headers});
  } else {
      await fetch(`${adminUrl}/clients`, {method: 'POST', body: encodedClient, headers});
  }

  // Get the user
  const userUrl = `${adminUrl}/users`;
  const user = (await (await fetch(`${userUrl}?username=service-account-${clientId}`, {headers})).json())[0];

  // Get the id of the ream-management client
  const realmManagementClients = await (await fetch(`${adminUrl}/clients?clientId=realm-management`, {headers})).json();
  const realmManagementClient = realmManagementClients[0];

  // Get the id of the manage-users role
  const manageUsersRole = (await (await fetch(`${adminUrl}/clients/${realmManagementClient.id}/roles/manage-users`, {headers})).json());

  // Add the role to the user
  const roleMapping = [manageUsersRole];
  await fetch(`${adminUrl}/users/${user.id}/role-mappings/clients/${realmManagementClient.id}`, {method: 'POST', body: JSON.stringify(roleMapping), headers});
}

await createClient(testClientId, testClientSecret);
await createClient(testPkceClientId);

