import { test as base } from '@fixtures/api.fixture';
import { LoginPage, HomePage, AutomationProcessesPage } from '@easyrpa/pages';
import { getUser, UserKey } from '@easyrpa/test-data/users';

type EasyRPAFixtures = {
  homePage: HomePage;
  apPage: AutomationProcessesPage;
};

const DEFAULT_USER: UserKey = 'adminUserDEV';

export const test = base.extend<EasyRPAFixtures>({
  homePage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    const user = getUser(DEFAULT_USER);
    await loginPage.loginWithCreds(user.username, user.password);
    const homePage = new HomePage(page);
    await use(homePage);
  },

  apPage: async ({ page, homePage }, use) => {
    await homePage.navigationMenu.openMenu();
    await homePage.navigationMenu.goToModule('Automation Processes');

    const apPage = new AutomationProcessesPage(page);
    await use(apPage);
  }
});

export { expect } from '@playwright/test';
