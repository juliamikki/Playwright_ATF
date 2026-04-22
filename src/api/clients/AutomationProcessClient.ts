import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from '@api/clients';
import { endpoints } from '@api/routes/endpoints';
import {
  CreateAPRequest,
  AutomationProcessResponse,
  SearchAPRequest,
  SearchAPResponse
} from '@api/models/automationProcess.model';

export class AutomationProcessClient extends BaseApiClient {
  constructor(request: APIRequestContext, token: string) {
    super(request, token);
  }

  async create(requestBody: CreateAPRequest): Promise<{ response: APIResponse; body: AutomationProcessResponse }> {
    const response = await this.post(endpoints.automationProcesses, requestBody);
    const body: AutomationProcessResponse = await response.json();
    return { response, body };
  }

  async createAndCleanup(
    data: CreateAPRequest
  ): Promise<{ response: APIResponse; cleanup: () => Promise<APIResponse> }> {
    const { response, body } = await this.create(data);
    return {
      response,
      cleanup: () => this.deleteById(body.id)
    };
  }

  async deleteById(id: number): Promise<APIResponse> {
    const response = await this.delete(`${endpoints.automationProcesses}/${id}`);
    return response;
  }

  async search(requestBody: SearchAPRequest): Promise<{ response: APIResponse; body: SearchAPResponse }> {
    const response = await this.post(`${endpoints.automationProcesses}/search`, requestBody);
    const body: SearchAPResponse = await response.json();
    return { response, body };
  }
}
