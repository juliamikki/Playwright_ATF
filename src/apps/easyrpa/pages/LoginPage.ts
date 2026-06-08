import { Page, Locator } from '@playwright/test';
import { BasePage } from '@easyrpa/pages';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get errorMessage(): Locator {
    return this.page.locator('.error-block-text');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async loginWithCreds(username: string, password: string): Promise<void> {
    await this.setInputById('input_username', username);
    await this.setInputById('input_password', password);
    await this.clickButton('Log In');
    await this.waitForExactPage();
  }
}
