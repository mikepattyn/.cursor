import express from 'express';
import { loadConfig } from './config.ts';

const config = loadConfig();
const app = express();

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', brokerUrl: config.brokerUrl });
});

const server = app.listen(config.port, '0.0.0.0', () => {
  process.stdout.write(
    `${JSON.stringify({ ts: new Date().toISOString(), level: 'info', message: 'worker listening', port: config.port })}\n`,
  );
});

function shutdown(signal: string): void {
  process.stdout.write(
    `${JSON.stringify({ ts: new Date().toISOString(), level: 'info', message: 'shutting down', signal })}\n`,
  );
  server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
