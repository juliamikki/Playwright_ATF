import { Page, Locator, expect } from '@playwright/test';
import { NavigationMenu, Message, Table, Dialog, SearchField } from '@easyrpa/components';

export abstract class BasePage {
  protected readonly page: Page;
  private readonly spinner: Locator;
  readonly navigationMenu: NavigationMenu;
  readonly search: SearchField;
  readonly table: Table;
  readonly dialog: Dialog;
  protected headerText?: string;

  constructor(page: Page) {
    this.page = page;
    this.spinner = this.page.getByRole('progressbar');
    this.navigationMenu = new NavigationMenu(page);
    this.search = new SearchField(page);
    this.table = new Table(page);
    this.dialog = new Dialog(page);
  }

  private button(buttonText: string): Locator {
    return this.page.locator('button', { hasText: buttonText });
  }

  private inputByLabel(label: string): Locator {
    return this.page.getByLabel(label);
  }

  private inputById(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

  get message(): Message {
    return new Message(this.page);
  }

  async searchFor(text: string): Promise<void> {
    await this.search.search(text);
    await this.table.waitForTable();
    await this.table.expectRowCount(1);
  }

  async clickButton(name: string): Promise<void> {
    await this.button(name).click();
  }

  async setInput(label: string, value: string): Promise<void> {
    await this.inputByLabel(label).fill(value);
  }

  async setInputById(label: string, value: string): Promise<void> {
    await this.inputById(label).fill(value);
  }

  getInput(label: string): Promise<string> {
    return this.inputByLabel(label).inputValue();
  }

  async goBackToList(): Promise<void> {
    await this.page.getByTestId('KeyboardBackspaceIcon').click();
    await this.waitForExactPage();
  }

  async clickBackToList(): Promise<void> {
    await this.page.getByTestId('KeyboardBackspaceIcon').click();
  }

  async waitForExactPage(): Promise<void> {
    await this.page.waitForLoadState('load');
    await this.spinner.waitFor({ state: 'detached' });
    if (this.headerText) {
      await this.expectHeader(this.headerText);
    }
  }

  protected async expectHeader(text: string): Promise<void> {
    const header = this.page.getByRole('heading', { name: text, level: 5 });
    await expect(header).toBeVisible();
  }
}
