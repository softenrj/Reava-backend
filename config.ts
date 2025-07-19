/* eslint-disable n/no-process-env */
import path from 'path';
import dotenv from 'dotenv';
import moduleAlias from 'module-alias';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV ?? 'development';

// Load .env file
dotenv.config();

// Setup module aliasing
moduleAlias.addAliases({
  '@src': path.join(__dirname, NODE_ENV === 'production' ? './dist' : './src'),
});
