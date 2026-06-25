export type DataStoreRecord = Record<string, string | number>;

export interface CreateDataStoreData {
  name: string;
  description: string;
  records: DataStoreRecord[];
}

export interface DataStoreResponse {
  id: number;
  name: string;
  description?: string;
  count: number;
  tableName: string;
  type: string;
  createTimeStamp: string;
  updateTimeStamp: string;
}

export interface DataStoreContextResponse {
  id: number;
  description: string;
}

export interface SearchDataStoreResponse {
  page: number;
  size: number;
  totalPages: number;
  totalRecords: number;
  records: DataStoreResponse[];
}
