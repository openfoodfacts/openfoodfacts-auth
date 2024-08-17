import { Locator, Page } from "@playwright/test";

export const gotoHome = async (page: Page) => await page.goto("/realms/open-products-facts/account/#/");

export const registerLink = (page: Page) => page.getByRole("link", { name: "Create an Open Food Facts account" });

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
      properties
    );
  };
 
  