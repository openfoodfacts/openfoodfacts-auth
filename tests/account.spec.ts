// @ts-check
import { test, expect, Locator } from "@playwright/test";
import { gotoHome, matchStyles, registerLink } from "./test-helper";
import { SECONDARY_BUTTON, SECONDARY_BUTTON_HOVER } from "./expected-styles";

test("account personal info", async ({ page }) => {
  await gotoHome(page);
  await registerLink(page).click();

  const randomUser = 'test-' + crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);
  const randomPassword = crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);
  await page.getByLabel('Username').fill(randomUser);
  await page.getByRole('textbox', {name:'Password', exact: true}).fill(randomPassword);
  await page.getByLabel('Confirm password').fill(randomPassword);
  await page.getByLabel('Email').fill(`${randomUser}@openfoodfacts.org`);

  await page.getByRole("button", { name: "Create an Open Food Facts account" }).click();

  // Account page will now load
  const cancelButton = page.getByRole("button", { name: "Cancel" });
  expect(await matchStyles(cancelButton, SECONDARY_BUTTON)).toBeNull();
  await cancelButton.hover();
  expect(await matchStyles(cancelButton, SECONDARY_BUTTON_HOVER)).toBeNull();

});
