import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from '@api/clients';
import { endpoints } from '@api/routes/endpoints';
import { CreateUserRequest, CreateUserResponse } from '@api/models/user.model';

export class UsersClient extends BaseApiClient {
  constructor(request: APIRequestContext, token: string) {
    super(request, token);
  }

  async create(requestBody: CreateUserRequest): Promise<{ response: APIResponse; body: CreateUserResponse }> {
    const response = await this.post(endpoints.users, requestBody);
    const body = await response.json();
    return { response, body };
  }

  async createAndCleanup(
    data: CreateUserRequest
  ): Promise<{ response: APIResponse; cleanup: () => Promise<APIResponse | undefined> }> {
    const { response, body } = await this.create(data);
    return {
      response,
      cleanup: () => this.deleteById(body.id)
    };
  }

  async deleteById(id?: number): Promise<APIResponse | undefined> {
    if (!id) {
      return undefined;
    }
    const response = await this.delete(`${endpoints.users}/${id}`);
    return response;
  }
}
