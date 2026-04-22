import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApiClient {
  protected request: APIRequestContext;
  protected token: string;

  constructor(request: APIRequestContext, token: string) {
    this.request = request;
    this.token = token;
  }

  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  protected async get(url: string): Promise<APIResponse> {
    this.logRequest('GET', url);
    const response = await this.request.get(url, {
      headers: this.getHeaders()
    });
    await this.logResponse(response);
    return response;
  }

  protected async post(url: string, data?: unknown): Promise<APIResponse> {
    this.logRequest('POST', url, data);
    const response = await this.request.post(url, {
      headers: this.getHeaders(),
      data
    });
    await this.logResponse(response);
    return response;
  }

  protected async put(url: string, data?: unknown): Promise<APIResponse> {
    this.logRequest('PUT', url, data);
    const response = await this.request.put(url, {
      headers: this.getHeaders(),
      data
    });
    await this.logResponse(response);
    return response;
  }

  protected async delete(url: string): Promise<APIResponse> {
    this.logRequest('DELETE', url);
    const response = await this.request.delete(url, {
      headers: this.getHeaders()
    });
    await this.logResponse(response);
    return response;
  }

  /* eslint-disable no-console */
  private logRequest(method: string, url: string, data?: unknown): void {
    console.log(`REQUEST: ${method} ${url}`);

    if (data) {
      console.log('REQUEST BODY:', JSON.stringify(data, null, 2));
    }
  }

  /* eslint-disable no-console */
  private async logResponse(response: APIResponse): Promise<void> {
    console.log(`RESPONSE STATUS: ${response.status()}`);

    const contentType = response.headers()['content-type'];

    if (contentType && contentType.includes('application/json')) {
      const body = await response.json();
      console.log('RESPONSE BODY:', JSON.stringify(body, null, 2));
    } else {
      const text = await response.text();
      console.log('RESPONSE TEXT:', text);
    }
  }
}
