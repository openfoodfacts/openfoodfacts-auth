import test, { expect } from "@playwright/test";
import { clickEmailVerifyLink, forgotPasswordLink, getLastEmail, gotoHome, registerLink, registerSnapshotUser, selectDummyLocale } from "./test-helper";

const setDesktop = async(page) => await page.setViewportSize({width: 1500, height: 1000});
const setMobile = async(page) => await page.setViewportSize({width: 400, height: 1000});
test("login", async ({ page }) => {
    await setDesktop(page);
    await gotoHome(page);
    await selectDummyLocale(page);
    await expect(page).toHaveScreenshot('login-desktop.png');

    await setMobile(page);
    await expect(page).toHaveScreenshot('login-mobile.png');
});

test("register", async ({ page }) => {
    await setDesktop(page);
    await gotoHome(page);
    await registerLink(page).click();
    await selectDummyLocale(page);
    await expect(page).toHaveScreenshot('register-desktop.png');

    await setMobile(page);
    await expect(page).toHaveScreenshot('register-mobile.png');
});

test("verify", async ({ page }) => {
    await setDesktop(page);
    await gotoHome(page);
    await registerLink(page).click();
    await selectDummyLocale(page);
    await registerSnapshotUser(page, 'verify');
    await expect(page).toHaveScreenshot('verify-desktop.png');

    await setMobile(page);
    await expect(page).toHaveScreenshot('verify-mobile.png');
});

test("account", async ({ page }) => {
    // Do mobile first as the side panel lingers on wider screens
    await setMobile(page);
    await gotoHome(page);
    await registerLink(page).click();
    await selectDummyLocale(page);
    const snapshotUsername = await registerSnapshotUser(page, 'account');
    const message = await getLastEmail(snapshotUsername);
    await clickEmailVerifyLink(page, message);
    // Expand the delete account section
    await page.getByRole('button', {name: '^deleteAccount^'}).click();

    await expect(page).toHaveScreenshot('account-mobile.png');

    await setDesktop(page);
    await expect(page).toHaveScreenshot('account-desktop.png');
});

test("forgot-password", async ({ page }) => {
    await setDesktop(page);
    await gotoHome(page);
    await selectDummyLocale(page);
    await forgotPasswordLink(page).click()
    await expect(page).toHaveScreenshot('forgot-password-desktop.png');

    await setMobile(page);
    await expect(page).toHaveScreenshot('forgot-password-mobile.png');
});

