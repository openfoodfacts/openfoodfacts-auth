// @ts-check
import { test, expect, Locator } from "@playwright/test";

export const matchColor = async (
  locator: Locator,
  property: string,
  value: string
) => {
  return locator.evaluate(
    (el: Element, [property, value]) => {
      var testDiv = document.createElement('div');
      testDiv.style.backgroundColor = value;
      testDiv.style.position = 'absolute';
      document.body.appendChild(testDiv);
      const expected = window.getComputedStyle(testDiv).getPropertyValue("background-color");
      document.body.removeChild(testDiv);
      const actual = window.getComputedStyle(el).getPropertyValue(property);
      return actual === expected ? true : actual;
    },
    [property, value]
  );
};

test("login page", async ({ page }) => {
  await page.goto("/realms/open-products-facts/account/#/");

  await expect(page).toHaveTitle("Sign in to Open Products Facts");

  const signInButton = page.getByRole("button", { name: "Sign In" });
  expect(await matchColor(signInButton, "background-color", "#341100")).toBe(
    true
  );
  await signInButton.hover();
  expect(await matchColor(signInButton, "background-color", "#622000")).toBe(
    true
  );
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
