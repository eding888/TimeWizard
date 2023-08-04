import config from './config.js';
export const checkAdmin = (token) => {
    if (token === config.ADMIN_KEY) {
        return true;
    }
    return false;
};
