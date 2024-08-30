import { test, expect } from "@playwright/test";
import { INPUT_FIELD } from "./expected-styles";
import { forgotPasswordLink, gotoHome, matchStyles } from "./test-helper";

test("general layout", async ({ page }) => {
  await gotoHome(page);
  await forgotPasswordLink(page).click();

  expect(await matchStyles(page.getByLabel('Username or email'), INPUT_FIELD)).toBeNull();
});

