import { test, expect } from "@playwright/test";
import { HELPER_TEXT } from "./expected-styles";
import { gotoHome, matchStyles, registerLink } from "./test-helper";

test("registration page", async ({ page }) => {
  await gotoHome(page);
  await registerLink(page).click();

  const beforeHelper = page.locator('.pf-c-form__helper-text-before:has-text("username"):above(#username)');
  expect(await matchStyles(beforeHelper, HELPER_TEXT)).toBeNull();

  const afterHelper = page.locator('.pf-c-form__helper-text-after:has-text("username"):below(#username)');
  expect(await matchStyles(afterHelper, HELPER_TEXT)).toBeNull();

});
