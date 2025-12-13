// @ts-check
import { test, expect } from "@playwright/test";
import { createAndVerifyUser, createRedisClient, generateRandomUser, getKeycloakHeaders, keycloakUserUrl, matchStyles } from "./test-helper";
import { SECONDARY_BUTTON, SECONDARY_BUTTON_HOVER } from "./expected-styles";

test("account personal info", async ({ page }) => {
  // Get the redis client before test so we have the current stream id
  const redisClient = await createRedisClient('user-registered');

  const {userName} = await createAndVerifyUser(page);

  const myMessage = await redisClient.getMessageForUser(userName);
  expect(myMessage).toBeTruthy();

  const cancelButton = page.getByRole("button", { name: "^cancel^" });
  expect(await matchStyles(cancelButton, SECONDARY_BUTTON)).toBeNull();
  await cancelButton.hover();
  expect(await matchStyles(cancelButton, SECONDARY_BUTTON_HOVER)).toBeNull();

  // Newsletter field should be hidden on edit
  await expect(page.getByLabel('^newsletter_description^')).not.toBeVisible();
  await expect(page.getByLabel('^this_is_a_pro_account^')).not.toBeVisible();
});

test("update display name", async ({ page }) => {
  // Get the redis client before test so we have the current stream id
  const redisClient = await createRedisClient('user-updated');

  const {userName} = await createAndVerifyUser(page);

  const newDisplayName = 'test-' + crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);

  await page.getByLabel('^name^').fill(newDisplayName);
  await page.locator('#country input').pressSequentially('fr');
  await page.getByText('France').click();

  await page.getByRole('button', {name: '^save^'}).click();
  await expect(page.getByText('^accountUpdatedMessage^')).toBeVisible();

  const myMessage = await redisClient.getMessageForUser(userName);
  expect(myMessage).toBeTruthy();
  expect(myMessage?.message.name).toBe(newDisplayName);
});

test("delete account", async ({ page }) => {
  // Get the redis client before test so we have the current stream id
  const redisClient = await createRedisClient('user-deleted');

  const {userName, password} = await createAndVerifyUser(page);

  await page.getByRole('button', {name: '^deleteAccount^'}).click();
  await page.getByRole('button', {name: '^delete^'}).click();

  // Not sure when the reauthenticate window appears
  const reauthenticate = page.getByText('^reauthenticate^');
  const confirm = page.getByText('^deleteAccountConfirm^');
  await expect(reauthenticate.or(confirm)).toBeVisible();
  if (await reauthenticate.isVisible()) {
    await page.getByLabel('^password^').fill(password);
    await page.getByRole('button', {name: '^doLogin^'}).click();
  }

  await expect(confirm).toBeVisible();
  await expect(page.getByText('^irreversibleAction^')).toBeVisible();

  await expect(page.getByText('^deletingImplies^')).toBeVisible();
  await expect(page.getByText('^loggingOutImmediately^')).toBeVisible();
  await expect(page.getByText('^errasingData^')).toBeVisible();
  await expect(page.getByText('^finalDeletionConfirmation^')).toBeVisible();

  await page.getByRole('button', {name: '^doConfirmDelete^'}).click();

  await expect(page.getByText('^userDeletedSuccessfully^')).toBeVisible();

  const myMessage = await redisClient.getMessageForUser(userName);
  expect(myMessage).toBeTruthy();
  expect(myMessage?.message.userName).toBe(userName);
  expect(myMessage?.message.newUserName).toBeTruthy();
});

test('update account via API generates event', async() => {
  const redisClient = await createRedisClient('user-updated');

  const {userName, password, email} = generateRandomUser();
  const userData = {
    email: email,
    emailVerified: true,
    enabled: true,
    username: userName,
    credentials: [{
      type: 'password',
      temporary: false,
      value: password,
    }],
    attributes: {
      name: userName,
      locale: 'xx',
      country: 'world',
      newsletter: 'subscribe',
      requested_org: 'carrefour',
    }
  };
  const newUser = JSON.stringify(userData);

  const headers = await getKeycloakHeaders();

  // Create the user
  await fetch(keycloakUserUrl, {method: 'POST', body: newUser, headers});
  const keycloakUsers = await (await fetch(`${keycloakUserUrl}?exact=true&username=${userName}&briefRepresentation=true`, {headers})).json();

  // Update user details
  userData.attributes.name = `updated-${userName}`;
  userData.attributes.locale = 'en';
  userData.attributes.country = 'fr';
  userData.email = `updated-${email}`;
  const updatedUser = JSON.stringify(userData);
  const updateResponse = await fetch(`${keycloakUserUrl}/${keycloakUsers[0].id}`, {method: 'PUT', body: updatedUser, headers});

  // Should send user-updated message
  const myMessage = await redisClient.getMessageForUser(userName);
  expect(myMessage).toBeTruthy();
  expect(myMessage?.message.email).toBe(`updated-${email}`);
  expect(myMessage?.message.name).toBe(`updated-${userName}`);
  expect(myMessage?.message.locale).toBe('en');
  expect(myMessage?.message.country).toBe('fr');
  expect(myMessage?.message.clientId).toBe('OFF');
});

test('delete user via API generates event', async() => {
  const redisClient = await createRedisClient('user-deleted');

  const {userName, password, email} = generateRandomUser();
  const userData = {
    email: email,
    emailVerified: true,
    enabled: true,
    username: userName,
    credentials: [{
      type: 'password',
      temporary: false,
      value: password,
    }],
    attributes: {
      name: userName,
      locale: 'xx',
      country: 'world',
      newsletter: 'subscribe',
      requested_org: 'carrefour',
    }
  };
  const newUser = JSON.stringify(userData);
  const headers = await getKeycloakHeaders();

  // Create the user
  await fetch(keycloakUserUrl, {method: 'POST', body: newUser, headers});
  const keycloakUsers = await (await fetch(`${keycloakUserUrl}?exact=true&username=${userName}&briefRepresentation=true`, {headers})).json();

  // Delete user
  const updateResponse = await fetch(`${keycloakUserUrl}/${keycloakUsers[0].id}`, {method: 'DELETE', headers});

  // Should send user-deleted message
  const myMessage = await redisClient.getMessageForUser(userName);
  expect(myMessage).toBeTruthy();
  expect(myMessage?.message.userName).toBe(userName);
  expect(myMessage?.message.newUserName).toBeTruthy();
});