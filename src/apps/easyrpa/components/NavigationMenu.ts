import { Page, Locator, expect } from '@playwright/test';
import { BaseComponent } from '@easyrpa/components';
import { AutomationProcessesPage, DataStoresPage, RunsManagementPage, UserManagementPage } from '@easyrpa/pages';

export class NavigationMenu extends BaseComponent {
  constructor(page: Page) {
    super(page.locator('.MuiDrawer-paper'));
  }

  private get arrow(): Locator {
    return this.root.locator('#arrow_icon');
  }

  private get expandedIcon(): Locator {
    return this.root.getByTestId('ChevronLeftIcon');
  }

  private get collapsedIcon(): Locator {
    return this.root.getByTestId('ChevronRightIcon');
  }

  private module(name: string): Locator {
    return this.root.getByRole('link', { name });
  }

  private section(name: string): Locator {
    return this.page.locator('.MuiButtonBase-root', { hasText: name });
  }

  private pages = {
    'Automation Processes': AutomationProcessesPage,
    'Runs Management': RunsManagementPage,
    'Data Stores': DataStoresPage,
    'Administration': {
      'User Management': UserManagementPage
    }
  };

  async goToModule(section: string, module?: string): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pages = this.pages as Record<string, any>;

    if (!module) {
      await this.module(section).click();

      const PageClass = pages[section];
      const pageInstance = new PageClass(this.page);
      await pageInstance.waitForExactPage();
      return pageInstance;
    }

    await this.section(section).click();
    await this.module(module).click();

    const PageClass = pages[section]?.[module];
    const pageInstance = new PageClass(this.page);
    await pageInstance.waitForExactPage();
    return pageInstance;
  }

  async openMenu(): Promise<void> {
    await this.waitForVisible();
    if (!(await this.isExpanded())) {
      await this.arrow.click();
    }
  }

  async closeMenu(): Promise<void> {
    await this.waitForVisible();
    if (await this.isExpanded()) {
      await this.arrow.click();
    }
  }

  async expectExpanded(): Promise<void> {
    await expect(this.expandedIcon).toBeVisible();
  }

  async expectCollapsed(): Promise<void> {
    await expect(this.collapsedIcon).toBeVisible();
  }

  private isExpanded(): Promise<boolean> {
    return this.expandedIcon.isVisible();
  }
}
