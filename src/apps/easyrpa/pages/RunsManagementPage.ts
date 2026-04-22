import { Page } from '@playwright/test';
import { BasePage } from '@easyrpa/pages';

export class RunsManagementPage extends BasePage {
  protected headerText = 'Runs Management';

  constructor(page: Page) {
    super(page);
  }
}
