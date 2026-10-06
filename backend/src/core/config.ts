import { config } from 'dotenv'

config();

export const {
  PORT_APP,
  HOST_APP,
  NODE_ENV
} = process.env

export const IS_PRODUCTION = NODE_ENV === 'production';

/** Comma separated list of allowed origins. Empty allows any origin. */
export const CORS_ORIGINS = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

/** Number of proxies in front of the app (load balancer, nginx...). Needed for correct client IPs. */
export const TRUST_PROXY = Number(process.env.TRUST_PROXY || 0);

export const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
export const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 300);

export const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 30_000);
export const SHUTDOWN_TIMEOUT_MS = Number(process.env.SHUTDOWN_TIMEOUT_MS || 10_000);
