/* eslint-disable no-empty-pattern */
import { test as base, request, APIRequestContext } from '@playwright/test';
import { AutomationProcessClient, UsersClient, AuthClient } from '@api/clients';
import { getEnv } from '@config/env';
import { CreateAPRequest } from '@api/models/automationProcess.model';
import { createUniqueAPData } from 'src/utils/apDataFactory';

type AutomationProcessContext = {
  apData: CreateAPRequest;
  apDataJson?: string;
  createdAPId?: number;
  createdRunId?: number;
};

type ApiFixtures = {
  apiContext: APIRequestContext;
  authToken: string;
  apClient: AutomationProcessClient;
  usersClient: UsersClient;
  apContext: AutomationProcessContext;
};

export const test = base.extend<ApiFixtures>({
  apiContext: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: getEnv('EASYRPA_DEV_URL')
    });
    await use(apiContext);
  },
  authToken: async ({ apiContext }, use) => {
    const authClient = new AuthClient(apiContext);
    const token = await authClient.getAccessToken();
    use(token);
  },
  apClient: async ({ apiContext, authToken }, use) => {
    const client = new AutomationProcessClient(apiContext, authToken);
    await use(client);
  },
  usersClient: async ({ apiContext, authToken }, use) => {
    const client = new UsersClient(apiContext, authToken);
    await use(client);
  },
  apContext: async ({}, use) => {
    const context: AutomationProcessContext = {
      apData: createUniqueAPData()
    };
    await use(context);
  }
});
