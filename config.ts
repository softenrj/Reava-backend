/* eslint-disable n/no-process-env */
import path from 'path'
import dotenv from 'dotenv'
import moduleAlias from 'module-alias'

const NODE_ENV = process.env.NODE_ENV ?? 'development'

// Load env file by mode
dotenv.config({ path: path.resolve(__dirname, `./config/.env.${NODE_ENV}`) })

// Optional: fallback to default .env if the specific one is missing
dotenv.config({ path: path.resolve(__dirname, './config/.env') })

// Setup module aliasing
moduleAlias.addAliases({
  '@src': path.join(__dirname, NODE_ENV === 'production' ? './dist' : './src'),
})
