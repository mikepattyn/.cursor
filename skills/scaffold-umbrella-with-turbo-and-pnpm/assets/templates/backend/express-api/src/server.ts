import { createApp } from './app.ts';
import { loadConfig } from './config.ts';
import { createLogger } from './logger.ts';
import { SqliteStore } from './store.ts';

const config = loadConfig();
const logger = createLogger(config.logLevel);
const store = new SqliteStore(config.sqlitePath);
const app = createApp({ store, logger });

const server = app.listen(config.port, '0.0.0.0', () => {
  logger.info('example-calculator-api listening', { port: config.port });
});

function shutdown(signal: string): void {
  logger.info('shutting down', { signal });
  server.close((error) => {
    store.close();
    if (error) {
      logger.error('shutdown failed', { error: error.message });
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
