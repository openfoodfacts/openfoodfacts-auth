import test, { expect } from "@playwright/test";
import { clickEmailVerifyLink, forgotPasswordLink, getLastEmail, gotoHome, registerLink, registerSnapshotUser, selectDummyLocale } from "./test-helper";

const setDesktop = async(page) => await page.setViewportSize({width: 1500, height: 1000});
const setMobile = async(page) => await page.setViewportSize({width: 400, height: 1000});

[
  { dark: false },
  { dark: true },
].forEach(({ dark }) => {
    const suffix = dark ? '-dark' : '';

    test(`login${suffix}`, async ({ page }) => {
        if (dark) await page.emulateMedia({ colorScheme: "dark" });
        await setDesktop(page);
        await gotoHome(page);
        await selectDummyLocale(page);
        await expect(page).toHaveScreenshot(`login-desktop${suffix}.png`);

        await setMobile(page);
        await expect(page).toHaveScreenshot(`login-mobile${suffix}.png`);
    });

    test(`register${suffix}`, async ({ page }) => {
        if (dark) await page.emulateMedia({ colorScheme: "dark" });
        await setDesktop(page);
        await gotoHome(page);
        await registerLink(page).click();
        await selectDummyLocale(page);
        await expect(page).toHaveScreenshot(`register-desktop${suffix}.png`);

        await setMobile(page);
        await expect(page).toHaveScreenshot(`register-mobile${suffix}.png`);
    });

    test(`verify${suffix}`, async ({ page }) => {
        if (dark) await page.emulateMedia({ colorScheme: "dark" });
        await setDesktop(page);
        await gotoHome(page);
        await registerLink(page).click();
        await selectDummyLocale(page);
        await registerSnapshotUser(page, `verify${suffix}`);
        await expect(page).toHaveScreenshot(`verify-desktop${suffix}.png`);

        await setMobile(page);
        await expect(page).toHaveScreenshot(`verify-mobile${suffix}.png`);
    });

    test(`account${suffix}`, async ({ page }) => {
        if (dark) await page.emulateMedia({ colorScheme: "dark" });
        // Do mobile first as the side panel lingers on wider screens
        await setMobile(page);
        await gotoHome(page);
        await registerLink(page).click();
        await selectDummyLocale(page);
        const snapshotUsername = await registerSnapshotUser(page, `account${suffix}`);
        const message = await getLastEmail(snapshotUsername);
        await clickEmailVerifyLink(page, message);
        // Expand the delete account section
        await page.getByRole('button', {name: '^deleteAccount^'}).click();

        await expect(page).toHaveScreenshot(`account-mobile${suffix}.png`);

        await setDesktop(page);
        await expect(page).toHaveScreenshot(`account-desktop${suffix}.png`);
    });

    test(`forgot-password${suffix}`, async ({ page }) => {
        if (dark) await page.emulateMedia({ colorScheme: "dark" });
        await setDesktop(page);
        await gotoHome(page);
        await selectDummyLocale(page);
        await forgotPasswordLink(page).click()
        await expect(page).toHaveScreenshot(`forgot-password-desktop${suffix}.png`);

        await setMobile(page);
        await expect(page).toHaveScreenshot(`forgot-password-mobile${suffix}.png`);
    });
});
