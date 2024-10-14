import { test, expect } from "@playwright/test";
import { HELPER_TEXT } from "./expected-styles";
import { createAndVerifyUser, createRedisClient, createUser, getLastEmail, gotoHome, matchStyles, registerLink } from "./test-helper";

test("general layout", async ({ page }) => {
  await gotoHome(page);
  await registerLink(page).click();

  const beforeHelper = page.locator('.pf-c-form__helper-text-before:has-text("public user id"):above(#username)');
  expect(await matchStyles(beforeHelper, HELPER_TEXT)).toBeNull();

  const afterHelper = page.locator('.pf-c-form__helper-text-after:has-text("public user id"):below(#username)');
  expect(await matchStyles(afterHelper, HELPER_TEXT)).toBeNull();

  // Check dropdown icons are being displayed
  await expect(page.locator('.pf-v5-c-form-control__toggle-icon:near(#login-select-toggle)')).toBeVisible();
  await expect(page.locator('.pf-v5-c-form-control__toggle-icon:near(#country)')).toBeVisible();

  // Check each field
  await page.getByLabel('Subscribe to the newsletter (2 emails per month maximum)').click();
  await page.getByLabel('If this is a producer or brand account then please enter the name of the producer or brand').fill('carrefour');
});

test("localization", async ({ page }) => {
  await gotoHome(page);
  await registerLink(page).click();

  const localeSelector = page.getByLabel("languages");
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

  await expect(countryInput).toHaveValue('DE');
});

test("verification email", async ({ page }) => {
  const redisClient = await createRedisClient('user-registered');

  const userName = await createUser(page);

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

  const userName = await createAndVerifyUser(page, true);

  const myMessage = await redisClient.getMessageForUser(userName);
  expect(myMessage).toBeTruthy();
  expect(myMessage?.message.newsletter).toBe('subscribe');
  expect(myMessage?.message.requested_org).toBe('carrefour');

  // Newsletter field should be hidden on edit
  await expect(page.getByLabel('^newsletter_description^')).not.toBeVisible();
  await expect(page.getByLabel('^this_is_a_pro_account^')).not.toBeVisible();
});

// TODO: Seem to be some scenarios where the language is not set against the user if they don't set it explicitly
