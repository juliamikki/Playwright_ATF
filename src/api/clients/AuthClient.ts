import { APIRequestContext } from '@playwright/test';
import { endpoints } from '@api/routes/endpoints';
import { getEnv } from '@config/env';

export class AuthClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getAccessToken(): Promise<string> {
    const response = await this.request.post(endpoints.auth, {
      form: {
        grant_type: 'client_credentials',
        client_id: getEnv('EASYRPA_DEV_ADMIN_API_CLIENT_ID'),
        client_secret: getEnv('EASYRPA_DEV_ADMIN_API_CLIENT_SECRET'),
        scope: getEnv('EASYRPA_API_SCOPE')
      }
    });

    if (!response.ok()) {
      throw new Error(`Authorization failed: ${await response.text()}`);
    }

    const body = await response.json();
    return body.access_token;
  }
}
