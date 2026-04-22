import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

//const EASYRPA_URL = process.env.EASYRPA_UAT_URL;
const EASYRPA_URL = process.env.EASYRPA_DEV_URL;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 40000, //test timeout - 30s by default
  expect: {
    timeout: 20000 //expect timeout - 5s by default
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  outputDir: './reports/test-results',
  reporter: [
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results' }]
  ],
  use: {
    trace: 'on',
    ignoreHTTPSErrors: true,

    //trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    //headless: false,
    headless: process.env.HEADLESS === 'true' || !!process.env.CI,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    /* easyrpa tests */
    {
      name: 'easyrpa-chrome',
      testDir: './tests/easyrpa/ui',
      use: {
        baseURL: EASYRPA_URL,
        browserName: 'chromium',
        channel: 'chrome',
        ...devices['Desktop Chrome']
      },
      workers: 1
    },
    {
      name: 'easyrpa-firefox',
      testDir: './tests/easyrpa/ui',
      use: {
        baseURL: EASYRPA_URL,
        browserName: 'firefox',
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'easyrpa-edge',
      testDir: './tests/easyrpa/ui',
      use: {
        baseURL: EASYRPA_URL,
        browserName: 'chromium',
        channel: 'msedge',
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'easyrpa-webkit',
      testDir: './tests/easyrpa/ui',
      use: {
        baseURL: EASYRPA_URL,
        browserName: 'webkit'
      }
    },
    {
      name: 'easyrpa-android',
      testDir: './tests/easyrpa/ui',
      use: {
        baseURL: EASYRPA_URL,
        browserName: 'chromium',
        ...devices['Pixel 5']
      }
    },
    {
      name: 'easyrpa-ios',
      testDir: './tests/easyrpa/ui',
      use: {
        baseURL: EASYRPA_URL,
        browserName: 'webkit',
        ...devices['iPhone 15']
      }
    },
    {
      name: 'easyrpa-api',
      testDir: './tests/easyrpa/api'
    }
  ]
});
