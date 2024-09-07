// @ts-check
import { test, expect } from "@playwright/test";
import { createAndVerifyUser, matchStyles } from "./test-helper";
import { SECONDARY_BUTTON, SECONDARY_BUTTON_HOVER } from "./expected-styles";

test("account personal info", async ({ page }) => {
  await createAndVerifyUser(page);

  const cancelButton = page.getByRole("button", { name: "^cancel^" });
  expect(await matchStyles(cancelButton, SECONDARY_BUTTON)).toBeNull();
  await cancelButton.hover();
  expect(await matchStyles(cancelButton, SECONDARY_BUTTON_HOVER)).toBeNull();

});
