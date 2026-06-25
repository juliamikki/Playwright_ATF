import { Page, expect } from '@playwright/test';
import { BaseComponent } from '@easyrpa/components';

export class Message extends BaseComponent {
  constructor(page: Page) {
    super(page.locator('.SnackbarContent-root'));
  }

  async expectTextAndClose(messageText: string): Promise<void> {
    const snackbar = this.root.filter({ hasText: messageText });
    await expect(snackbar).toBeVisible();
    await snackbar.getByTestId('CloseIcon').click();
  }
}
