import { Page, Locator, expect } from '@playwright/test';
import { BaseComponent } from '@easyrpa/components';

export class SidePanel extends BaseComponent {
  constructor(page: Page) {
    super(page.locator('#details_panel'));
  }

  private get heading(): Locator {
    return this.root.getByRole('heading');
  }

  private field(name: string): Locator {
    return this.root.locator(`[name="${name}"]`);
  }

  private button(name: string): Locator {
    return this.root.getByRole('button', { name });
  }

  async setInput(name: string, value: string): Promise<void> {
    await this.field(name).fill(value);
  }

  async clickButton(name: string): Promise<void> {
    await this.button(name).click();
  }

  async expectHeader(headingText: string): Promise<void> {
    await expect(this.heading).toHaveText(headingText);
  }

  async waitForClosed(): Promise<void> {
    await expect(this.root).toBeHidden();
  }
}
