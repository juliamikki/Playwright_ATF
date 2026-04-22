import { Page, Locator, expect } from '@playwright/test';
import { BaseComponent } from '@easyrpa/components';

export class TabContainer<T extends string> extends BaseComponent {
  constructor(page: Page) {
    super(page.getByRole('tablist'));
  }

  private tab(name: T): Locator {
    return this.root.getByRole('tab', { name });
  }

  async goToTab(name: T): Promise<void> {
    await this.tab(name).click();
    await this.expectTabToBeActive(name);
  }

  async expectTabToBeActive(name: T): Promise<void> {
    await expect(this.tab(name)).toHaveAttribute('aria-selected', 'true');
  }
}
