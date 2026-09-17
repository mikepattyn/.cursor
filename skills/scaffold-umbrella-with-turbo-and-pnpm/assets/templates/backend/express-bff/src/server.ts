import { createApp } from './app.ts';
import { loadConfig } from './config.ts';
import { createLogger } from './logger.ts';

const config = loadConfig();
const logger = createLogger(config.logLevel);
const app = createApp({ config, logger });

const server = app.listen(config.port, '0.0.0.0', () => {
  logger.info('example-bff listening', { port: config.port });
});

function shutdown(signal: string): void {
  logger.info('shutting down', { signal });
  server.close((error) => {
    if (error) {
      logger.error('shutdown failed', { error: error.message });
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
