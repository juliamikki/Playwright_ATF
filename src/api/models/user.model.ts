export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  groups: {
    id: number;
    name: string;
  }[];
}

export interface CreateUserResponse {
  id: number;
  updateTimeStamp: string;
  createTimeStamp: string;

  firstName: string;
  lastName: string;
  email: string;
  username: string;

  groups: {
    id: number;
    name: string;
  }[];

  defaultGroup: {
    id: number;
    name: string;
  };

  deleted: boolean;
  systemUser: boolean;
  fullName: string;

  _permissions: string[];
}
