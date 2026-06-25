import { randomUUID } from 'node:crypto';
import { CreateAPRequest, SearchAPRequest } from '@api/models/automationProcess.model';
import baseData from '@easyrpa/test-data/files/test-automation-process.json' with { type: 'json' };
import searchData from '@easyrpa/test-data/files/search-automation-process.json' with { type: 'json' };

type Predicate = 'CONTAINS' | 'EQUALS';

export function createUniqueAPData(): CreateAPRequest {
  const uniqueSuffix = randomUUID();
  return {
    ...baseData,
    name: `${baseData.name} [${uniqueSuffix}]`
  };
}

export function createSearchRequest(key: string, value: string, predicate: Predicate = 'EQUALS'): SearchAPRequest {
  const searchDataTyped = searchData as SearchAPRequest;
  return {
    ...searchDataTyped,
    filter: {
      ...searchDataTyped.filter,
      key,
      value,
      predicate
    }
  };
}

export function convertAPDataToJson(apData: CreateAPRequest): string {
  return JSON.stringify(apData, null, 2);
}
