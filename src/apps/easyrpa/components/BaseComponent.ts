import { Page, Locator, expect } from '@playwright/test';

export abstract class BaseComponent {
  protected readonly root: Locator;

  constructor(root: Locator) {
    this.root = root;
  }

  protected get page(): Page {
    return this.root.page();
  }

  async waitForVisible(timeout = 5000): Promise<void> {
    await expect(this.root).toBeVisible({ timeout });
  }
}
