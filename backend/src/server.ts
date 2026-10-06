import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { rateLimit } from 'express-rate-limit'

import { routes } from './core/routes';
import { scopePerRequest } from 'awilix-express';
import container from './container';
import {
  CORS_ORIGINS,
  IS_PRODUCTION,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  TRUST_PROXY,
} from './core/config';

const server = express();

server.set('trust proxy', TRUST_PROXY);
server.disable('x-powered-by');

server.use(helmet());
server.use(cors({ origin: CORS_ORIGINS.length ? CORS_ORIGINS : true }));
server.use(compression());
server.use(rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  limit: RATE_LIMIT_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { data: null, message: 'Too many requests, please try again later.' },
}));
server.use(morgan(IS_PRODUCTION ? 'combined' : 'dev'))
server.use(express.json({ limit: '100kb' }))
server.use(express.urlencoded({ extended: true, limit: '100kb' }));
server.use(scopePerRequest(container));
server.use(routes)

server.use((_req: Request, res: Response) => {
  res.status(404).json({ data: null, message: 'Not found' });
});

server.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err?.status || err?.statusCode || 500;
  if (status >= 500) console.error(err);

  res.status(status).json({
    data: null,
    message: status >= 500 ? 'Internal Server Error' : err.message,
  });
});

export { server }
