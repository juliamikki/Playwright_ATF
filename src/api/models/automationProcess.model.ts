export interface CreateAPRequest {
  name: string;
  description: string;
  repositoryId: string;
  moduleClass: string;
  dedicated: boolean;
  capabilities: string[];
  dedicatedNodes: string[];
  params: unknown[];
  input: {
    parent: unknown[];
    variables: Record<string, unknown>;
    _id: string;
  };
  groups: {
    id: number;
    name: string;
  }[];
}

export interface AutomationProcessResponse {
  id: number;
  updateTimeStamp: string;
  createTimeStamp: string;
  createdBy: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    fullName: string;
  };
  updatedBy: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    fullName: string;
  };
  uuid: string;
  name: string;
  description: string;
  repositoryId: string;
  moduleClass: string;
  dedicated: boolean;
  statistic: Record<string, unknown>;
  capabilities: unknown[];
  dedicatedNodes: unknown[];
  params: unknown[];
  groups: {
    id: number;
    name: string;
  }[];
  _permissions: string[];
}

export interface SearchAPRequest {
  pageNumber?: number;
  pageSize?: number;
  direction?: 'ASC' | 'DESC';
  sortColumns?: string[];
  offset?: number;
  filter: {
    type: 'matcher';
    key: string;
    value: string;
    predicate: 'CONTAINS' | 'EQUALS';
    empty?: boolean;
    array?: boolean;
  };
}

export interface SearchAPResponse {
  page: number;
  size: number;
  totalPages: number;
  totalRecords: number;
  records: AutomationProcessResponse[];
}
