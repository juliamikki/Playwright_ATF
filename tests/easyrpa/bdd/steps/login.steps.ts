import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage, HomePage } from '@easyrpa/pages';
import { CustomWorld } from '@easyrpa/support/CustomWorld';
import { getUser, UserKey } from '@easyrpa/test-data/users';

Given('I am logged in as {string}', async function (this: CustomWorld, userKey: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.open();
  const user = getUser(userKey as UserKey);
  await loginPage.loginWithCreds(user.username, user.password);
  this.loginPage = loginPage;
});

Then('I should see the home page', async function (this: CustomWorld) {
  this.homePage = new HomePage(this.page);
  await expect(this.homePage.mainHeader).toBeVisible();
});

Then('I should see an error message {string}', async function (this: CustomWorld, message: string) {
  await expect(this.loginPage.errorMessage).toHaveText(message);
});
