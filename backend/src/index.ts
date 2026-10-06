import { config } from 'dotenv'

import { server } from './server'
import { IS_PRODUCTION, PORT_APP, REQUEST_TIMEOUT_MS, SHUTDOWN_TIMEOUT_MS } from './core/config';
import { prismaClient } from './libs/PrismaClient';

config();

const port = PORT_APP || 3333;

async function bootstrap() {
  try {
    await prismaClient.$connect();
  } catch (err) {
    console.error(err);
    await prismaClient.$disconnect();
    process.exit(1);
  }

  const httpServer = server.listen(port, () => {
    if (!IS_PRODUCTION) console.clear();
    console.log(`Server running on port ${port}.`)
    console.log(`Database connected.`)
  });

  httpServer.requestTimeout = REQUEST_TIMEOUT_MS;
  // Must be higher than the load balancer idle timeout (usually 60s) to avoid 502s
  httpServer.keepAliveTimeout = 65_000;
  httpServer.headersTimeout = 66_000;

  let shuttingDown = false;

  const shutdown = (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received, shutting down...`);

    setTimeout(() => {
      console.error('Shutdown timed out, forcing exit.');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS).unref();

    httpServer.close(async (err) => {
      if (err) console.error(err);
      await prismaClient.$disconnect();
      process.exit(err ? 1 : 0);
    });
    httpServer.closeIdleConnections();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap();
