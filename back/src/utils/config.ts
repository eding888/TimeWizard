import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '../../');
const envPath = join(rootDir, '.env');

dotenv.config({ path: envPath });

const PORT: string = process.env.PORT!;
const MONGO_URL: string = (process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGO_URL!
  : process.env.MONGO_URL!);
const SECRET: string = process.env.SECRET!;

export default { PORT, MONGO_URL, SECRET };
