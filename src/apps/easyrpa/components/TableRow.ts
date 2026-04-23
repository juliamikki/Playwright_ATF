import { Locator, expect } from '@playwright/test';
import { BaseComponent } from '@easyrpa/components';
import { Checkbox } from '@easyrpa/elements';

export class TableRow extends BaseComponent {
  constructor(locator: Locator) {
    super(locator);
  }

  private get checkbox(): Checkbox {
    return new Checkbox(this.root.getByRole('checkbox'));
  }

  private get link(): Locator {
    return this.root.getByRole('link');
  }

  private button(name: string): Locator {
    return this.root.locator(`[aria-label='${name}'] button`);
  }

  private get cells(): Locator {
    return this.root.getByRole('cell');
  }

  private getCellByIndex(index: number): Locator {
    return this.cells.nth(index);
  }

  async expectCellValueByHeader(headerName: string, value: string): Promise<void> {
    const headers = await this.page.getByRole('columnheader').allTextContents();
    const index = headers.findIndex((header) => header === headerName);
    await expect(this.getCellByIndex(index)).toHaveText(value);
  }

  async check(): Promise<void> {
    await this.checkbox.check();
  }

  async clickLink(): Promise<void> {
    await this.link.click();
  }

  async clickButton(name: string): Promise<void> {
    await this.button(name).click();
  }
}
