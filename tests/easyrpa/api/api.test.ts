import { test } from '@fixtures/api.fixture';
import { expect } from '@playwright/test';
import user from '@easyrpa/test-data/files/test-user.json' assert { type: 'json' };

test('create automation process @smoke', async ({ apClient, apContext }) => {
  const { createResponse, cleanup } = await apClient.createAndCleanup(apContext.apData);
  expect(createResponse.status()).toBe(200);
  await cleanup();
});

test('start and stop automation process run', async ({ apClient, apContext }) => {
  const { createResponse, createBody, cleanup } = await apClient.createAndCleanup(apContext.apData);
  expect(createResponse.status()).toBe(200);

  const { startResponse, startBody } = await apClient.startRun(createBody.id);
  expect(startResponse.status()).toBe(200);

  const stopResponse = await apClient.stopRun(startBody.id);
  expect(stopResponse.status()).toBe(200);

  await cleanup();
});

test('create user', async ({ usersClient }) => {
  const { response, cleanup } = await usersClient.createAndCleanup(user);
  expect(response.status()).toBe(200);
  await cleanup();
});
