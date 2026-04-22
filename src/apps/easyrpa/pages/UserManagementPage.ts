import { Page } from '@playwright/test';
import { BasePage } from '@easyrpa/pages';

export class UserManagementPage extends BasePage {
  protected headerText = 'User Management';

  constructor(page: Page) {
    super(page);
  }
}
