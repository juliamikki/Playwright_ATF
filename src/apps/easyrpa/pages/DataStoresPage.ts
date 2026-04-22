import { Page } from '@playwright/test';
import { BasePage } from '@easyrpa/pages';

export class DataStoresPage extends BasePage {
  protected headerText = 'Data Stores';

  constructor(page: Page) {
    super(page);
  }
}
