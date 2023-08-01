import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current module's file URL and convert it to the corresponding file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Calculate the path to the .env file in the root directory
const rootDir = join(__dirname, '../../');
const envPath = join(rootDir, '.env');

// Load the environment variables from the .env file
dotenv.config({ path: envPath });

const PORT: string = process.env.PORT!;
const MONGO_URL: string = (process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGO_URL!
  : process.env.MONGO_URL!);
const SECRET: string = process.env.SECRET!;

export default { PORT, MONGO_URL, SECRET };
