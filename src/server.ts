import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import http from 'http';
import logger from 'primelogger';


if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}

import ENV, { NodeEnvs } from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/util/route-errors';
import router from './route';

// Server
const app = express();
const server = http.createServer(app);

// CORS
const allowedOrigins = ['http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Logging (dev and production)
if (ENV.NodeEnv === NodeEnvs.Development) {
  app.use(morgan('dev'));
} else if (ENV.NodeEnv === NodeEnvs.Production) {
  app.use(morgan('combined')); // more detailed logs in production
  app.use(helmet());
}

// Routes
router(app);

// Error Handler
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Test) {
    logger.error(err);
  }

  const status = err instanceof RouteError ? err.status : HttpStatusCodes.BAD_REQUEST;
  res.status(status).json({
    error: err instanceof RouteError ? err.message : 'Something went wrong',
  });

  return next(err);
});

export default app;
