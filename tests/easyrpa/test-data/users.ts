import { getEnv } from '@config/env';

export type User = {
  username: string;
  password: string;
};

export const users = {
  adminUserUAT: {
    username: 'admin',
    get password() {
      return getEnv('EASYRPA_UAT_ADMIN_PASSWORD');
    }
  },
  adminUserDEV: {
    username: 'testautomation2',
    get password() {
      return getEnv('EASYRPA_DEV_ADMIN_PASSWORD');
    }
  },
  wrongUser: {
    username: 'wrong user',
    password: 'wrong password'
  }
} as const;

export type UserKey = keyof typeof users;

export function getUser(userKey: UserKey): User {
  const user = users[userKey];

  if (!user) {
    throw new Error(`Unknown user: ${userKey}`);
  }

  return user;
}
