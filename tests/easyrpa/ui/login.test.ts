import { test, expect } from '@fixtures/easyrpa.fixture';
import { LoginPage } from '@easyrpa/pages';
import { getUser } from '@easyrpa/test-data/users';

test.describe('EasyRPA Login Feature', () => {
  test('shows error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    const user = getUser('wrongUser');
    await loginPage.loginWithCreds(user.username, user.password);
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials for user');
  });

  test('redirects to home page on valid credentials @smoke', async ({ homePage }) => {
    await expect(homePage.mainHeader).toBeVisible();
  });
});
