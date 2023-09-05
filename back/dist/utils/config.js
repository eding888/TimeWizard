import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// This file extracts sensitive data from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../../');
const envPath = join(rootDir, '.env');
dotenv.config({ path: envPath });
const PORT = process.env.PORT;
const TEST = process.env.NODE_ENV === 'test';
const MONGO_URI = (TEST
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI);
const SECRET = process.env.SECRET;
const EMAIL = process.env.EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS;
const MAILSAC_KEY = process.env.MAILSAC_KEY;
export default { PORT, MONGO_URI, SECRET, EMAIL, EMAIL_PASS, TEST, MAILSAC_KEY };
