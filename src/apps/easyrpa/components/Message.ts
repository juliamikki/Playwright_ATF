import { Page, Locator, expect } from '@playwright/test';
import { BaseComponent } from '@easyrpa/components';

export class Message extends BaseComponent {
  constructor(page: Page) {
    super(page.locator('.SnackbarContent-root'));
  }

  private get closeButton(): Locator {
    return this.root.getByTestId('CloseIcon');
  }

  async expectTextAndClose(messageText: string): Promise<void> {
    await expect(this.root).toHaveText(messageText);
    await this.closeButton.click();
  }
}
