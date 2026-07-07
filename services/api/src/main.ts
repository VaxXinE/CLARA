import { loadEnv } from './config/env';
import { createServer } from './http/server';

const env = loadEnv();
const app = await createServer({ env });

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  app.log.info({ signal }, 'Shutting down CLARA API');

  try {
    await app.close();
    process.exit(0);
  } catch (error) {
    app.log.error({ err: error }, 'Failed to shutdown CLARA API cleanly');
    process.exit(1);
  }
}

process.on('SIGINT', (signal) => {
  void shutdown(signal);
});

process.on('SIGTERM', (signal) => {
  void shutdown(signal);
});

try {
  await app.listen({
    host: env.HOST,
    port: env.PORT
  });

  app.log.info(
    {
      host: env.HOST,
      port: env.PORT
    },
    `CLARA API listening on http://${env.HOST}:${env.PORT}`
  );
} catch (error) {
  app.log.error({ err: error }, 'Failed to start CLARA API');
  process.exit(1);
}
