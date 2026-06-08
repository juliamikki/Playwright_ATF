import dotenv from 'dotenv';
dotenv.config();

import { chromium } from '@playwright/test';
import { Before, After } from '@cucumber/cucumber';
import { CustomWorld } from '@easyrpa/support/CustomWorld';
import { getEnv } from '@config/env';

import fs from 'fs';

const isHeadless = process.env.HEADLESS === 'true';

/**
 * Runs before each Cucumber scenario.
 *
 * Responsibilities:
 * - Launch a new Playwright browser instance
 * - Create a fresh browser context and page
 * - Start Playwright tracing for debugging
 *
 * @param this - CustomWorld instance containing shared test context
 */
Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({
    headless: isHeadless
  });
  const context = await this.browser.newContext({
    baseURL: getEnv('EASYRPA_DEV_URL')
  });
  this.context = context;
  this.page = await context.newPage();
  await this.context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true
  });
});

/**
 * Runs after each Cucumber scenario.
 *
 * Responsibilities:
 * - Stop Playwright tracing and save trace file
 * - Attach trace file to Cucumber report
 * - Capture and attach screenshot
 * - Clean up browser resources
 *
 * @param this - CustomWorld instance containing shared test context
 * @param scenario - Cucumber scenario hook parameter containing scenario metadata
 */
After(async function (this: CustomWorld, scenario) {
  const scenarioName = scenario.pickle.name.replace(/\s+/g, '_');
  const tracePath = `reports/traces/${scenarioName}.zip`;

  await this.context.tracing.stop({ path: tracePath });

  if (fs.existsSync(tracePath)) {
    const traceBuffer = fs.readFileSync(tracePath);
    this.attach(traceBuffer, 'application/zip');
    this.attach(`Trace file saved at: ${tracePath}\nOpen with:\n npx playwright show-trace ${tracePath}`, 'text/plain');
  }

  const screenshot = await this.page.screenshot({ fullPage: true });
  this.attach(screenshot, 'image/png');

  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
