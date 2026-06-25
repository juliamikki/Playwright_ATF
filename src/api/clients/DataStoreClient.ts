import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from '@api/clients';
import { endpoints } from '@api/routes/endpoints';
import {
  CreateDataStoreData,
  DataStoreContextResponse,
  DataStoreResponse,
  SearchDataStoreResponse
} from '@api/models/dataStore.model';
import { convertRecordsToCsv } from '@factories/dataStoreDataFactory';

export class DataStoreClient extends BaseApiClient {
  constructor(request: APIRequestContext, token: string) {
    super(request, token);
  }

  /**
   * Creates a data store the same way the UI does:
   * 1. upload the records as a CSV file to obtain an "api context"
   * 2. create the data store from that context
   * 3. resolve the created data store by name (creation is async, so the
   *    `/create` response only returns an IN_PROGRESS job, not the store id)
   */
  async create(data: CreateDataStoreData): Promise<{ createResponse: APIResponse; createBody: DataStoreResponse }> {
    const context = await this.uploadContext(convertRecordsToCsv(data.records));
    const { id: contextId } = (await context.json()) as DataStoreContextResponse;

    const createResponse = await this.post(`${endpoints.dataStores}/api_context/${contextId}/create`, {
      data: { name: data.name, description: data.description }
    });

    const createBody = await this.findByName(data.name);
    return { createResponse, createBody };
  }

  async deleteById(id?: number): Promise<APIResponse | undefined> {
    if (!id) {
      return undefined;
    }
    const response = await this.delete(`${endpoints.dataStores}/${id}`);
    return response;
  }

  async search(filterValue?: string): Promise<{ response: APIResponse; body: SearchDataStoreResponse }> {
    const filter = filterValue
      ? {
          filter: {
            type: 'qp',
            composition: 'OR',
            values: [{ type: 'matcher', key: 'name', predicate: 'CONTAINS', value: filterValue }]
          }
        }
      : {};
    const response = await this.post(`${endpoints.dataStores}/search`, {
      pageNumber: 0,
      pageSize: 10,
      direction: 'DESC',
      sortColumns: ['createTimeStamp'],
      ...filter
    });
    const body: SearchDataStoreResponse = await response.json();
    return { response, body };
  }

  private async uploadContext(csv: string): Promise<APIResponse> {
    const url = `${endpoints.dataStores}/api_context`;
    const response = await this.request.post(url, {
      headers: { Authorization: `Bearer ${this.token}` },
      multipart: {
        file: { name: 'records.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) }
      }
    });
    return response;
  }

  /** Data store creation is async, so poll the search endpoint until the store appears. */
  private async findByName(name: string, attempts = 10, intervalMs = 500): Promise<DataStoreResponse> {
    for (let i = 0; i < attempts; i++) {
      const { body } = await this.search(name);
      const match = body.records.find((record) => record.name === name);
      if (match) {
        return match;
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    throw new Error(`Data store "${name}" was not found after creation`);
  }
}
