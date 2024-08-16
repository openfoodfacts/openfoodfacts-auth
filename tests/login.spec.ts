// @ts-check
import { test, expect, Locator } from "@playwright/test";
import { INPUT_FIELD, PRIMARY_BUTTON, PRIMARY_BUTTON_HOVER } from "./expected-styles";
import { matchStyles } from "./test-helper";

test("login page", async ({ page }) => {
  await page.goto("/realms/open-products-facts/account/#/");

  await expect(page).toHaveTitle("Sign in to Open Products Facts");

  const signInButton = page.getByRole("button", { name: "Sign In" });
  expect(await matchStyles(signInButton, PRIMARY_BUTTON)).toBeNull();
  await signInButton.hover();
  expect(await matchStyles(signInButton, PRIMARY_BUTTON_HOVER)).toBeNull();

  expect(await matchStyles(page.getByLabel('Username or email'), INPUT_FIELD)).toBeNull();
});

test("locale selector supports incremental search", async ({ page }) => {
  await page.goto("/realms/open-products-facts/account/#/");

  const localeSelector = page.getByLabel("languages");
  await localeSelector.click();
  await localeSelector.pressSequentially("fr");
  await localeSelector.press("Tab");

  await expect(page.getByRole("button", { name: "Connexion" })).toBeVisible();
});

test("create account link", async ({ page }) => {
  await page.goto("/realms/open-products-facts/account/#/");

  // Click the get started link.
  await page
    .getByRole("link", { name: "Create an Open Food Facts account" })
    .click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();
});
