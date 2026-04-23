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

  async create(
    requestBody: CreateAPRequest
  ): Promise<{ createResponse: APIResponse; createBody: AutomationProcessResponse }> {
    const createResponse = await this.post(endpoints.automationProcesses, requestBody);
    const createBody: AutomationProcessResponse = await createResponse.json();
    return { createResponse, createBody };
  }

  async createAndCleanup(data: CreateAPRequest): Promise<{
    createResponse: APIResponse;
    createBody: AutomationProcessResponse;
    cleanup: () => Promise<APIResponse>;
  }> {
    const { createResponse, createBody } = await this.create(data);
    return {
      createResponse,
      createBody,
      cleanup: () => this.deleteById(createBody.id)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async startRun(id: number): Promise<{ startResponse: APIResponse; startBody: any }> {
    const startResponse = await this.post(`${endpoints.automationProcesses}/${id}/runs`);
    const startBody = await startResponse.json();
    return { startResponse, startBody };
  }

  async stopRun(id: number): Promise<APIResponse> {
    const response = await this.put(`${endpoints.runs}/${id}/stop`);
    return response;
  }
}
