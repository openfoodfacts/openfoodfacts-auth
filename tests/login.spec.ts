// @ts-check
import { test, expect, Locator } from "@playwright/test";
import { INPUT_FIELD, LINK, PRIMARY_BUTTON, PRIMARY_BUTTON_HOVER } from "./expected-styles";
import { clickEmailVerifyLink, createRedisClient, getKeycloakHeaders, getLastEmail, getLocaleSelector, gotoHome, gotoTestPage, keycloakUserUrl, matchStyles, populateRegistrationForm } from "./test-helper";

test("login page", async ({ page }) => {
  await gotoHome(page);

  await expect(page).toHaveTitle("Sign in to Open Products Facts");

  const signInButton = page.getByRole("button", { name: "Sign In" });
  expect(await matchStyles(signInButton, PRIMARY_BUTTON)).toBeNull();
  await signInButton.hover();
  expect(await matchStyles(signInButton, PRIMARY_BUTTON_HOVER)).toBeNull();

  expect(await matchStyles(page.getByLabel('Public user id or email'), INPUT_FIELD)).toBeNull();
});

test("locale selector supports incremental search", async ({ page }) => {
  await gotoHome(page);

  const localeSelector = page.locator("#login-select-toggle");
  await localeSelector.click();
  await localeSelector.pressSequentially("fr");
  await localeSelector.press("Tab");

  await expect(page.getByRole("button", { name: "Connexion" })).toBeVisible();
});

test("locale selector always shows in same language", async ({ page }) => {
  await gotoHome(page);

  const localeSelector = getLocaleSelector(page);
  await localeSelector.click();
  await localeSelector.pressSequentially("fr");
  await localeSelector.press("Tab");

  await expect(page.getByRole("button", { name: "Connexion" })).toBeVisible();

  await localeSelector.click();
  await localeSelector.pressSequentially("eng");
  await localeSelector.press("Tab");

  await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
});

test("create account link", async ({ page }) => {
  await gotoHome(page);

  const link = page.getByRole("link", { name: "Create an Open Food Facts account" });
  expect(await matchStyles(link, LINK)).toBeNull();
  
  // Click the get started link.
  await link.click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();
});

test("locale from app is respected", async ({ page }) => {
  const redisClient = await createRedisClient('user-registered');

  await gotoTestPage(page, 'xx');
  await page.getByRole("button", { name: "Login" }).click();

  // Login page
  await expect(page).toHaveTitle("^loginTitle 0=Open Products Facts^");
  await page.getByRole("link", { name: "^doRegister^" }).click();

  // Registration page
  expect(page.getByText('^registerTitle^')).toBeVisible();
  const {userName} = await populateRegistrationForm(page);

  // Redis event should not be created before the email has been verified
  const myMessage = await redisClient.getMessageForUser(userName);
  expect(myMessage).toBeFalsy();
  
  const message = await getLastEmail(userName);
  expect(message.plaintext).toContain('^emailVerificationBody 0=');

  // Open a new tab to verify the email
  const verifyPage = await page.context().newPage();
  await clickEmailVerifyLink(verifyPage, message);

  // Login should occur on the original page and on the verify page
  for (const testPage of [verifyPage, page]) {
    await expect(testPage.getByLabel('preferred_username')).toHaveValue(userName);
    expect(testPage.url()).toContain('lang=xx');
  
    await testPage.getByRole("button", { name: "Account" }).click();

    // Since Keycloak 26.2.0 it looks like you have to log in again to see your account info
    await expect(testPage.getByText('^loginAccountTitle^')).toBeVisible();
  }

  const myMessage2 = await redisClient.getMessageForUser(userName);
  expect(myMessage2).toBeTruthy();
  expect(myMessage2?.message.clientId).toBe(process.env.TEST_CLIENT_ID);

  // Fetch the user via API and make sure locale is set correctly
  const headers = await getKeycloakHeaders();
  const users = await (await fetch(`${keycloakUserUrl}?exact=true&username=${userName}`, {headers})).json();
  expect(users[0].attributes.locale[0]).toBe('xx');
});
