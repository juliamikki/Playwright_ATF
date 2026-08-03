import { test, expect, request } from '@playwright/test';
import { AutomationProcessClient } from '@api/clients/AutomationProcessClient';
import { PactV3, MatchersV3, SpecificationVersion } from '@pact-foundation/pact';
import { endpoints } from '@api/routes/endpoints';

const { like } = MatchersV3;

const provider = new PactV3({
  consumer: 'easyrpa-frontend',
  provider: 'easyrpa-backend',
  logLevel: 'warn', //debug for full logs
  dir: 'tests/easyrpa/contracts/pacts',
  spec: SpecificationVersion.SPECIFICATION_VERSION_V3,
  host: '127.0.0.1' // default value, explicit for clarity
});

test.describe('Automation Process API Pact contract', () => {
  test('process exists', async () => {
    await provider.addInteraction({
      states: [{ description: 'Automation process with ID 1 exists' }],
      uponReceiving: 'a request to get automation process by ID',
      withRequest: {
        method: 'GET',
        path: `${endpoints.automationProcesses}/1`,
        headers: {
          Authorization: like('Bearer fake-token')
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': like('application/json')
        },
        body: like({
          id: 1,
          name: 'test_automation_process [c9ab025a-bb41-4ab5-ba12-24ca4bbe2a65]',
          description: 'This is an automation process for testing purposes.'
        })
      }
    });

    await provider.executeTest(async (mockService) => {
      const apiContext = await request.newContext({ baseURL: mockService.url });
      const client = new AutomationProcessClient(apiContext, 'fake-token');

      const { response, body } = await client.getById(1);

      expect(response.status()).toBe(200);
      expect(body.id).toBe(1);
      expect(body.name).toBe('test_automation_process [c9ab025a-bb41-4ab5-ba12-24ca4bbe2a65]');
      expect(body.description).toBe('This is an automation process for testing purposes.');

      await apiContext.dispose(); // closes the Playwright request context and frees its resources
    });
  });

  test('process does not exist', async () => {
    await provider.addInteraction({
      states: [{ description: 'Automation process with ID 999 does not exist' }],
      uponReceiving: 'a request to get automation process by ID that does not exist',
      withRequest: {
        method: 'GET',
        path: `${endpoints.automationProcesses}/999`,
        headers: {
          Authorization: like('Bearer fake-token')
        }
      },
      willRespondWith: {
        status: 404,
        headers: {
          'Content-Type': like('application/json')
        },
        body: like({})
      }
    });

    await provider.executeTest(async (mockService) => {
      const apiContext = await request.newContext({ baseURL: mockService.url });
      const client = new AutomationProcessClient(apiContext, 'fake-token');

      const { response } = await client.getById(999);

      expect(response.status()).toBe(404);

      await apiContext.dispose();
    });
  });
});
