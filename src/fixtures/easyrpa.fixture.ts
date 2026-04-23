import { test as base } from '@fixtures/api.fixture';
import { LoginPage, HomePage, AutomationProcessesPage, RunsManagementPage } from '@easyrpa/pages';
import { getUser, UserKey } from '@easyrpa/test-data/users';

type EasyRPAFixtures = {
  homePage: HomePage;
  apPage: AutomationProcessesPage;
  runsPage: RunsManagementPage;
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
  },

  runsPage: async ({ page }, use) => {
    const runsPage = new RunsManagementPage(page);
    await use(runsPage);
  }
});

export { expect } from '@playwright/test';
