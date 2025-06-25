import { test, expect } from "@playwright/test";
import { HELPER_TEXT } from "./expected-styles";
import { createAndVerifyUser, createRedisClient, createUser, generateRandomUser, getKeycloakHeaders, getLastEmail, getLocaleSelector, gotoHome, keycloakUserUrl, matchStyles, registerLink, selectDummyLocale } from "./test-helper";

test("general layout", async ({ page }) => {
  await gotoHome(page);
  await registerLink(page).click();

  const beforeHelper = page.locator('#form-help-text-before-username:has-text("public user id"):above(#username)');
  expect(await matchStyles(beforeHelper, HELPER_TEXT)).toBeNull();

  const afterHelper = page.locator('#form-help-text-after-username:has-text("public user id"):below(#username)');
  expect(await matchStyles(afterHelper, HELPER_TEXT)).toBeNull();

  // Check dropdown icons are being displayed
  await expect(page.locator('.pf-v5-c-form-control__toggle-icon:near(#login-select-toggle)')).toBeVisible();
  await expect(page.locator('.pf-v5-c-form-control__toggle-icon:near(#country)')).toBeVisible();

  // Check each field
  await page.getByLabel('Subscribe to the newsletter (2 emails per month maximum)').click();
  await page.getByLabel('Producer or Brand Name (if applicable)').fill('carrefour');
});

test("localization", async ({ page }) => {
  await gotoHome(page);
  await registerLink(page).click();

  const localeSelector = getLocaleSelector(page);
  await localeSelector.click();
  await localeSelector.pressSequentially("fr");
  await localeSelector.press("Tab");

  const countryInput = page.getByRole("combobox", { name: "Pays" });
  await expect(countryInput).toBeVisible();
  await countryInput.click();

  // Check countries are sorted by localized name
  await countryInput.pressSequentially("alg"); // This should position us on Algérie
  await countryInput.press("ArrowDown"); // If the options are sorted correctly the next option should be Allemagne
  await countryInput.press("Tab");

  await expect(countryInput).toHaveValue('de');
});

test("verification email", async ({ page }) => {
  const redisClient = await createRedisClient('user-registered');

  const {userName} = await createUser(page);

  // Redis event should not be created before the email has been verified
  const myMessage = await redisClient.getMessageForUser(userName);
  expect(myMessage).toBeFalsy();

  const message = await getLastEmail(userName);
  expect(message.plaintext).toContain('^emailVerificationBody 0=');
  expect(message.html).toContain('^emailVerificationBodyHtml 0');
});

test("newsletter and producer fields", async ({ page }) => {
  // Get the redis client before test so we have the current stream id
  const redisClient = await createRedisClient('user-registered');

  const {userName} = await createAndVerifyUser(page, true);

  const myMessage = await redisClient.getMessageForUser(userName);
  expect(myMessage).toBeTruthy();
  expect(myMessage?.message.newsletter).toBe('subscribe');
  expect(myMessage?.message.requestedOrg).toBe('carrefour');
  expect(myMessage?.message.clientId).toBe('account-console');

  // Newsletter field should be hidden on edit
  await expect(page.getByLabel('^newsletter_description^')).not.toBeVisible();
  await expect(page.getByLabel('^this_is_a_pro_account^')).not.toBeVisible();
});

test("user created by API doesn't need email verification", async ({page}) => {
  const redisClient = await createRedisClient('user-registered');

  const {userName, password, email} = generateRandomUser();
  const user = JSON.stringify({
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
  });

  const headers = await getKeycloakHeaders();

  const createResponse = await fetch(keycloakUserUrl, {method: 'POST', body: user, headers});

  // Should send registration message immediately
  const myMessage = await redisClient.getMessageForUser(userName);
  expect(myMessage).toBeTruthy();
  expect(myMessage?.message.newsletter).toBe('subscribe');
  expect(myMessage?.message.requestedOrg).toBe('carrefour');
  expect(myMessage?.message.email).toBe(email);
  expect(myMessage?.message.userName).toBe(userName);
  expect(myMessage?.message.clientId).toBe('test_client');
});

test("migrated user with invalid email loaded with no messages", async ({page}) => {
  const redisClient = await createRedisClient('user-registered');

  const {userName, password, email} = generateRandomUser();
  const user = JSON.stringify({
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
      registered: 'registered',
      old_email: 'invalid@madeupname',
    }
  });

  const headers = await getKeycloakHeaders();

  const createResponse = await fetch(keycloakUserUrl, {method: 'POST', body: user, headers});

  // Should send registration message immediately
  const myMessage = await redisClient.getMessageForUser(userName);
  expect(myMessage).toBeFalsy();
});

test("six character password accepted", async ({ page }) => {
  await gotoHome(page);
  await registerLink(page).click();

  // Use dummy locale so we can test general localization
  await selectDummyLocale(page);

  const {userName, email} = generateRandomUser();
  const password = 'aaaaaa';
  await page.getByLabel('^username^').fill(userName);
  await page.getByRole('textbox', { name: '^password^', exact: true }).fill(password);
  await page.getByLabel('^passwordConfirm^').fill(password);
  await page.getByLabel('^email^').fill(email);

  await page.getByRole("button", { name: "^doRegister^" }).click();

  // Verify email page will now load. Extend timeout to avoid test issues
  await expect(page.getByText('^emailVerifyTitle^')).toBeVisible();
});

test("five character password not accepted", async ({ page }) => {
  await gotoHome(page);
  await registerLink(page).click();

  // Use dummy locale so we can test general localization
  await selectDummyLocale(page);

  const {userName, email} = generateRandomUser();
  const password = '12345';
  await page.getByLabel('^username^').fill(userName);
  await page.getByRole('textbox', { name: '^password^', exact: true }).fill(password);
  await page.getByLabel('^passwordConfirm^').fill(password);
  await page.getByLabel('^email^').fill(email);

  await page.getByRole("button", { name: "^doRegister^" }).click();

  // Verify email page will now load. Extend timeout to avoid test issues
  await expect(page.getByText('^invalidPasswordMinLengthMessage 0=6^')).toBeVisible();
});

