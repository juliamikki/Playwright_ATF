import { test } from '@fixtures/api.fixture';
import { expect } from '@playwright/test';
import user from '@easyrpa/test-data/files/test-user.json' with { type: 'json' };

test('create automation process @smoke', async ({ apClient, apContext }) => {
  const { createResponse, createBody, cleanup } = await apClient.createAndCleanup(apContext.apData);
  
  expect(createResponse.status()).toBe(200);
  expect(createBody.name).toBe(apContext.apData.name);
  expect(createBody.description).toBe(apContext.apData.description);
  
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
