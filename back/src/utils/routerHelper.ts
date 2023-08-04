import config from './config.js';

export const checkAdmin = (token: string | null | undefined) => {
  if (token === config.ADMIN_KEY) {
    return false;
  }
  return true;
};
