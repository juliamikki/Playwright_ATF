import { test } from '@fixtures/easyrpa.fixture';

test.describe('Navigation', () => {
  test('should open navigation menu successfully @smoke', async ({ homePage }) => {
    const menu = homePage.navigationMenu;
    await menu.openMenu();
    await menu.expectExpanded();

    await menu.closeMenu();
    await menu.expectCollapsed();
  });

  test('should navigate through main menu items', async ({ homePage }) => {
    const modules = ['Automation Processes', 'Runs Management', 'Data Stores'];
    await homePage.navigationMenu.openMenu();
    for (const module of modules) {
      await homePage.navigationMenu.goToModule(module);
    }
  });

  test('should navigate through nested menu section', async ({ homePage }) => {
    await homePage.navigationMenu.openMenu();
    await homePage.navigationMenu.goToModule('Administration', 'User Management');
  });
});
