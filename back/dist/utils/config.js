import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || '8080';
const MONGO_URL = (process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGO_URL
    : process.env.MONGO_URL) || '';
const SECRET = process.env.SECRET || '';
export default { PORT, MONGO_URL, SECRET };
