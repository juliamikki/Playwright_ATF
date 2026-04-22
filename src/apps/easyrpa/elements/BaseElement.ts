import { Locator } from '@playwright/test';

export abstract class BaseElement {
  protected readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
  }

  async click(): Promise<void> {
    await this.locator.click();
  }

  isVisible(): Promise<boolean> {
    return this.locator.isVisible();
  }

  isEnabled(): Promise<boolean> {
    return this.locator.isEnabled();
  }
}
