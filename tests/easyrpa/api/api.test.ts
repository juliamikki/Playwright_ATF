import { test } from '@fixtures/api.fixture';
import { expect } from '@playwright/test';
import user from '@easyrpa/test-data/files/test-user.json' assert { type: 'json' };

test('create automation process @smoke', async ({ apClient, apContext }) => {
  const { response, cleanup } = await apClient.createAndCleanup(apContext.apData);
  expect(response.status()).toBe(200);
  await cleanup();
});

test.skip('create user', async ({ usersClient }) => {
  const { response, cleanup } = await usersClient.createAndCleanup(user);
  expect(response.status()).toBe(200);
  await cleanup();
});
