import { randomUUID } from 'node:crypto';
import { CreateDataStoreData, DataStoreRecord } from '@api/models/dataStore.model';
import baseData from '@easyrpa/test-data/files/test-data-store.json' with { type: 'json' };
import records from '@easyrpa/test-data/files/test-ds-records.json' with { type: 'json' };

export function createUniqueDataStoreData(): CreateDataStoreData {
  const uniqueSuffix = randomUUID();
  return {
    ...baseData,
    name: `${baseData.name}_${uniqueSuffix}`,
    records: records as DataStoreRecord[]
  };
}

export function convertRecordsToCsv(data: DataStoreRecord[]): string {
  const headers = Object.keys(data[0]);
  const rows = data.map((record) => headers.map((header) => String(record[header])).join(','));
  return [headers.join(','), ...rows].join('\n');
}
