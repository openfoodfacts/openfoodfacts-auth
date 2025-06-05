import { defineConfig, devices} from '@playwright/test';
import dotenv from 'dotenv';

// Read from ".env" file.
dotenv.config({ path: ['.envrc','.env'] });

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // 30000ms and 5000ms isn't always enough
  timeout: 60000,
  expect: { timeout: 10000 }, 
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  //retries: process.env.CI ? 2 : 0,
  // Temporarily suspend retries
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    trace: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    // Disabled webkit for now as it is unreliable
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    /* Note we don't use a command here as playwright won't wait for the initialisation scripts to run 
       Need to run make test to ensure everything is up and running */
    url: process.env.KEYCLOAK_BASE_URL,
    reuseExistingServer: true,
  },

  expect: {
    toHaveScreenshot: { 
      /* This figure is by trial and error to minimize false positives when running tests locally
        Note the reference images are created in the GitHub action by logging a `/update-screenshots` comment */
      maxDiffPixels: process.env.CI ? 0 : 7000,

      /* The following ensures we pick up background color block changes 
      without being so fussy as to detect subtle shadow changes */
      threshold: 0.1,
    },
  },
});
