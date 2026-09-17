import { randomUUID } from 'node:crypto';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import type { Logger } from './logger.ts';
import type { SqliteStore } from './store.ts';

export type AppDeps = {
  store: SqliteStore;
  logger: Logger;
};

export function createApp(deps: AppDeps): Express {
  const app = express();
  app.use(express.json());
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = String(req.headers['x-request-id'] ?? randomUUID());
    res.setHeader('x-request-id', requestId);
    deps.logger.info('request', { requestId, method: req.method, path: req.path });
    next();
  });

  app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/readyz', (_req, res) => {
    if (!deps.store.ready()) {
      res.status(503).json({ status: 'unavailable' });
      return;
    }
    res.json({ status: 'ok' });
  });

  app.get('/value', (_req, res) => {
    try {
      res.json(deps.store.get());
    } catch {
      res.status(500).json({ error: 'read failed' });
    }
  });

  app.put('/value', (req, res) => {
    const value = req.body?.value;
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      res.status(400).json({ error: 'invalid body' });
      return;
    }
    try {
      res.json(deps.store.put(value));
    } catch {
      res.status(500).json({ error: 'write failed' });
    }
  });

  return app;
}
