import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../../');
const envPath = join(rootDir, '.env');
dotenv.config({ path: envPath });
const PORT = process.env.PORT;
const MONGO_URI = (process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI);
const SECRET = process.env.SECRET;
const ADMIN_KEY = process.env.ADMIN_KEY;
export default { PORT, MONGO_URI, SECRET, ADMIN_KEY };
