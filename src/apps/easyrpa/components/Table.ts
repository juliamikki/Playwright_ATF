import { Page, Locator, expect } from '@playwright/test';
import { BaseComponent, TableRow } from '@easyrpa/components';

export class Table extends BaseComponent {
  private readonly spinner: Locator;

  constructor(page: Page) {
    super(page.locator('.MuiTable-stickyHeader'));
    this.spinner = this.page.getByRole('progressbar');
  }

  private get rows(): Locator {
    return this.root.locator('tbody').getByRole('row').filter({ visible: true });
  }

  private rowLocatorByCellValue(value: string, exact: boolean = true): Locator {
    return this.rows.filter({
      has: this.page.getByRole('cell', { name: value, exact })
    });
  }

  getHeaderRow(): TableRow {
    return new TableRow(this.root.locator('thead').getByRole('row'));
  }

  getRowByIndex(index: number): TableRow {
    const row = this.rows.nth(index);
    return new TableRow(row);
  }

  getRowByCellValue(value: string): TableRow {
    return new TableRow(this.rowLocatorByCellValue(value));
  }

  async expectRowToExist(value: string): Promise<void> {
    await expect(this.rowLocatorByCellValue(value)).toHaveCount(1);
  }

  async expectRowNotToExist(value: string): Promise<void> {
    await expect(this.rowLocatorByCellValue(value)).toHaveCount(0);
  }

  async expectRowCount(count: number): Promise<void> {
    await expect(this.rows).toHaveCount(count);
  }

  async expectToBeEmpty(): Promise<void> {
    await this.expectRowCount(0);
  }

  async waitForTable(): Promise<void> {
    await this.spinner.waitFor({ state: 'detached' });
    await expect(this.root.locator('tbody')).toBeVisible();
  }
}
