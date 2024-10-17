// @ts-check
import { test, expect, Locator } from "@playwright/test";
import { INPUT_FIELD, LINK, PRIMARY_BUTTON, PRIMARY_BUTTON_HOVER } from "./expected-styles";
import { gotoHome, gotoTestPage, matchStyles } from "./test-helper";

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

  const localeSelector = page.getByLabel("languages");
  await localeSelector.click();
  await localeSelector.pressSequentially("fr");
  await localeSelector.press("Tab");

  await expect(page.getByRole("button", { name: "Connexion" })).toBeVisible();
});

test("locale selector always shows in same language", async ({ page }) => {
  await gotoHome(page);

  const localeSelector = page.getByLabel("languages");
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
  await gotoTestPage(page, 'xx');

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveTitle("^loginTitle 0=Open Products Facts^");
});

// TODO: Test that locale passed in URL is respected
