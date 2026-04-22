import { Page, Locator, expect } from '@playwright/test';
import { BaseComponent } from '@easyrpa/components';

export class Dialog extends BaseComponent {
  constructor(page: Page) {
    super(page.getByRole('dialog'));
  }

  private get heading(): Locator {
    return this.root.getByRole('heading');
  }

  private get message(): Locator {
    return this.root.locator('#confirm-modal-description');
  }

  private get error(): Locator {
    return this.root.locator('#file-format-error');
  }

  private button(name: string): Locator {
    return this.root.getByRole('button', { name });
  }

  async clickButton(name: string): Promise<void> {
    await this.button(name).click();
  }

  async uploadFile(filePath: string, fileContent?: string): Promise<void> {
    const inputField = this.root.locator('input[type="file"]');

    if (fileContent) {
      await inputField.setInputFiles({
        name: filePath,
        mimeType: 'application/json',
        buffer: Buffer.from(fileContent)
      });
    } else {
      await inputField.setInputFiles(filePath);
    }
  }

  async expectError(errorText: string): Promise<void> {
    await expect(this.error).toHaveText(errorText);
  }

  async expectHeader(headingText: string): Promise<void> {
    await expect(this.heading).toHaveText(headingText);
  }

  async expectMessage(messageText: string): Promise<void> {
    await expect(this.message).toHaveText(messageText);
  }

  async waitForClosed(): Promise<void> {
    await expect(this.root).toBeHidden();
  }
}
