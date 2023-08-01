import dotenv from 'dotenv';
dotenv.config();

const PORT: string = process.env.PORT!;
const MONGO_URL: string = (process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGO_URL!
  : process.env.MONGO_URL!);
const SECRET: string = process.env.SECRET!;

export default { PORT, MONGO_URL, SECRET };
