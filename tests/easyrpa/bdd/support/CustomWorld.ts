import { Browser, BrowserContext, Page } from '@playwright/test';
import { World, setWorldConstructor } from '@cucumber/cucumber';
import { LoginPage, HomePage } from '@easyrpa/pages';

/**
 * Custom Cucumber World for Playwright tests.
 *
 * @remarks
 * This class follows a strict convention for property initialization:
 *
 * - `!` (non-null assertion): indicates that the property is always initialized before use;
 *   used for required objects that are guaranteed to be set during the test lifecycle.
 *
 * - `?` (optional property): indicates that the property may be undefined;
 *   used for objects that are initialized conditionally or lazily.
 *
 * This convention helps:
 * - Clearly distinguish required vs optional dependencies
 * - Improve readability and intent
 * - Prevent unsafe access to uninitialized properties
 *
 * @example
 * ```ts
 * browser!: Browser;   - always initialized
 * homePage?: HomePage; - initialized only when needed
 * ```
 */
export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  baseURL!: string;
  page!: Page;
  loginPage!: LoginPage;
  homePage!: HomePage;
}

setWorldConstructor(CustomWorld);
