import { test, expect } from "@playwright/test";
import { INPUT_FIELD } from "./expected-styles";
import { createAndVerifyUser, forgotPasswordLink, getLastEmail, gotoHome, matchStyles, selectDummyLocale } from "./test-helper";

test("general layout", async ({ page }) => {
  await gotoHome(page);
  await selectDummyLocale(page);
  await forgotPasswordLink(page).click();

  expect(await matchStyles(page.getByLabel('^usernameOrEmail^'), INPUT_FIELD)).toBeNull();
});

test("email", async ({ page }) => {
  const {userName} = await createAndVerifyUser(page);

  // Log out
  await page.getByTestId('options-toggle').click();
  await page.getByRole('menuitem', {name: '^signOut^'}).click();

  // Click forgot password link
  await forgotPasswordLink(page).click();
  await page.getByLabel('^usernameOrEmail^').fill(userName);
  await page.getByRole("button", { name: '^doSubmit^' }).click();

  await expect(page.getByText('^emailSentMessage^')).toBeVisible();

  const message = await getLastEmail(userName);
  expect(message.plaintext).toContain('^passwordResetBody 0=');
  expect(message.html).toContain('^passwordResetBodyHtml 0');

  // Check that expiry minutes formatting choice is used
  expect(message.plaintext).toContain('^linkExpirationFormatter.timePeriodUnit.minutes 0=minutes^');

});