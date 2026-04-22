import { Page, Locator } from '@playwright/test';
import { BasePage } from '@easyrpa/pages';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get mainHeader(): Locator {
    return this.page.locator('.MuiTypography-root', { hasText: 'EasyRPA Control Server' });
  }
}
