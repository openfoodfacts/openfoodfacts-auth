import { expect, Locator, Page } from "@playwright/test";
import { createClient } from "redis";

const keycloak = `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM_NAME}`;
export const gotoHome = async (page: Page) => await page.goto(`${keycloak}/account/#/`);
export const registerLink = (page: Page) => page.getByRole("link", { name: "Create an Open Food Facts account" });
export const forgotPasswordLink = (page: Page) => page.getByRole("link", { name: "^doForgotPassword^" });
export const gotoTestPage = async (page: Page, lang?: string) => await page.goto(`http://localhost:5604/index.html?clientId=${
  process.env.TEST_CLIENT_ID
}&clientSecret=${
  process.env.TEST_CLIENT_SECRET
}&lang=${
  lang
}&keycloak=${encodeURIComponent(keycloak)}`);
const smtp4devApi = `http://localhost:${process.env.SMTP4DEV_PORT}/api/Messages`;

export const matchStyles = async (
    locator: Locator,
    properties: any
  ) => {
    return locator.evaluate(
      (el: HTMLElement, properties: any) => {
        const toKebabCase = (str: string) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($: string, ofs: any) => (ofs ? "-" : "") + $.toLowerCase());
        
        const errors = new Array<string>();
        var testElement = el.cloneNode() as HTMLElement;
        testElement.style.position = 'absolute';
        document.body.appendChild(testElement);

        // Remember what transparent looks like
        testElement.style.backgroundColor = 'transparent';
        const transparent = window.getComputedStyle(testElement).getPropertyValue('background-color');

        for (const [property, value] of Object.entries(properties)) {
          testElement.style[property] = value;
          const propertyName = toKebabCase(property);
          const expected = window.getComputedStyle(testElement).getPropertyValue(propertyName);

          let actual: string;
          let target = el;
          do {
            actual = window.getComputedStyle(target).getPropertyValue(propertyName);
            if (actual !== transparent) break;
            // Go to the parent if we get a transparent color
            target = target.parentElement as HTMLElement;
          } while (target)
          if (actual !== expected) errors.push(`${property}: ${actual}, expected ${expected}`);
        }
        document.body.removeChild(testElement);
        return errors.length ? errors.join('; ') : null;
      },
      properties,
      {timeout: 5000}
    );
  };
 
export const createUser = async (page: Page, allFields = false) => {
  await gotoHome(page);
  await registerLink(page).click();

  // Use dummy locale so we can test general localization
  await selectDummyLocale(page);

  const randomUser = await populateRegistrationForm(page, allFields);

  return randomUser;
}

export const createAndVerifyUser = async(page: Page, allFields = false) => {
  const userName = await createUser(page, allFields);
  const message = await getLastEmail(userName);
  await clickEmailVerifyLink(page, message);
  await expect(page.getByText('^personalInfoDescription^')).toBeVisible();
  return userName;
}

export const selectDummyLocale = async(page: Page) => {
  const localeSelector = page.getByLabel("languages");
  await localeSelector.click();
  await localeSelector.pressSequentially("xx");
  await localeSelector.press("Tab");
  return localeSelector;
}

export const deleteEmails = async() => {
  // Delete messages from smtp4dev
  await fetch(`${smtp4devApi}/*`, {method: 'DELETE'});
}

export const getLastEmail = async(userName: string) => {
  // Get most recent message
  const messages = await (await fetch(`${smtp4devApi}/new`)).json();
  const lastMessage = messages.filter((m) => m.to[0] === `${userName}@openfoodfacts.org`).sort((a, b) => a.receivedDate.localeCompare(b.receivedDate)).pop();
  expect(lastMessage).toBeTruthy();
  const messageId = lastMessage.id;
  const message = await (await fetch(`${smtp4devApi}/${messageId}`)).json();
  message.plaintext = await (await fetch(`${smtp4devApi}/${messageId}/plaintext`)).text();
  message.html = await (await fetch(`${smtp4devApi}/${messageId}/html`)).text();
  return message;
}

export const createRedisClient = async(stream: string) => {
  const redisClient = createClient();
  await redisClient.connect();
  const range = await redisClient.xRevRange(stream, '+', '-', {COUNT: 1});
  const start = range[0]?.id || '0-0';

  return {
    getMessageForUser: async(userName: string) => {
      const newMessages = await redisClient.xRead({key: stream, id: start}, {BLOCK: 1, COUNT: 100});
      return newMessages?.[0].messages.find((m) => m.message.userName === userName);
    }
  };
}

export async function clickEmailVerifyLink(page: Page, message: any) {
  const verifyUrl = message.plaintext.split('0=')[1].split(', 2=')[0];
  await page.goto(verifyUrl);
}

export async function populateRegistrationForm(page: Page, allFields = false) {
  const {userName, password, email} = generateRandomUser();
  await page.getByLabel('^username^').fill(userName);
  await page.getByRole('textbox', { name: '^password^', exact: true }).fill(password);
  await page.getByLabel('^passwordConfirm^').fill(password);
  await page.getByLabel('^email^').fill(email);

  if (allFields) {
    await page.getByLabel('^newsletter_description^').click();
    await page.getByLabel('^this_is_a_pro_account^').fill('carrefour');
  }

  await page.getByRole("button", { name: "^doRegister^" }).click();

  // Verify email page will now load. Extend timeout to avoid test issues
  await expect(page.getByText('^emailVerifyTitle^')).toBeVisible({ timeout: 10000 });
  return userName;
}

export function generateRandomUser() {
  const userName = 'test-' + crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);
  const password = crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);
  const email = `${userName}@openfoodfacts.org`;

  return {userName, password, email};
}