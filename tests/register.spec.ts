import { test, expect } from "@playwright/test";
import { HELPER_TEXT } from "./expected-styles";
import { gotoHome, matchStyles, registerLink } from "./test-helper";

test("general layout", async ({ page }) => {
  await gotoHome(page);
  await registerLink(page).click();

  const beforeHelper = page.locator('.pf-c-form__helper-text-before:has-text("username"):above(#username)');
  expect(await matchStyles(beforeHelper, HELPER_TEXT)).toBeNull();

  const afterHelper = page.locator('.pf-c-form__helper-text-after:has-text("username"):below(#username)');
  expect(await matchStyles(afterHelper, HELPER_TEXT)).toBeNull();

  // Check dropdown icons are being displayed
  await expect(page.locator('.pf-v5-c-form-control__toggle-icon:near(#login-select-toggle)')).toBeVisible();
  await expect(page.locator('.pf-v5-c-form-control__toggle-icon:near(#country)')).toBeVisible();
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