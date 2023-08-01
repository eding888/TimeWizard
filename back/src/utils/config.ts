import dotenv from 'dotenv';
dotenv.config();

const PORT: string = process.env.PORT || '8080';
const MONGO_URL: string = (process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGO_URL
  : process.env.MONGO_URL) || '';

export default { PORT, MONGO_URL };
