import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@easyrpa/components';

export class SearchField extends BaseComponent {
  private readonly input: Locator;

  constructor(page: Page) {
    super(page.locator('#search_field'));
    this.input = this.root;
  }

  async search(value: string): Promise<void> {
    await this.input.fill(value);
  }
}
