import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// This file extracts sensitive data from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '../../');
const envPath = join(rootDir, '.env');

dotenv.config({ path: envPath });

const PORT: string = process.env.PORT!;
const TEST: boolean = process.env.NODE_ENV === 'test';
const MONGO_URI: string = (TEST
  ? process.env.TEST_MONGO_URI!
  : process.env.MONGO_URI!);
console.log(MONGO_URI);
const SECRET: string = process.env.SECRET!;
const EMAIL: string = process.env.EMAIL!;
const EMAIL_PASS: string = process.env.EMAIL_PASS!;
const MAILSAC_KEY: string = process.env.MAILSAC_KEY!;

export default { PORT, MONGO_URI, SECRET, EMAIL, EMAIL_PASS, TEST, MAILSAC_KEY };
