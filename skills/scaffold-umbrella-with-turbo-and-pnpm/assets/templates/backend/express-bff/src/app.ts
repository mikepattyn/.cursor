import { randomUUID } from 'node:crypto';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import type { Config } from './config.ts';
import { proxyCalculator, type FetchLike } from './clients/calculator.ts';
import type { Logger } from './logger.ts';

export type AppDeps = {
  config: Config;
  logger: Logger;
  fetchImpl?: FetchLike;
};

export function createApp(deps: AppDeps): Express {
  const app = express();
  const fetchImpl = deps.fetchImpl ?? fetch;

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

  app.get('/readyz', async (_req, res) => {
    try {
      const upstream = await fetchImpl(`${deps.config.calculatorUrl}/healthz`, {
        signal: AbortSignal.timeout(deps.config.upstreamTimeoutMs),
      });
      if (!upstream.ok) {
        res.status(503).json({ status: 'unavailable' });
        return;
      }
      res.json({ status: 'ok' });
    } catch {
      res.status(503).json({ status: 'unavailable' });
    }
  });

  async function proxy(req: Request, res: Response): Promise<void> {
    const requestId = String(res.getHeader('x-request-id') ?? randomUUID());
    try {
      const upstream = await proxyCalculator(
        fetchImpl,
        deps.config.calculatorUrl,
        req.method,
        req.body,
        deps.config.upstreamTimeoutMs,
        requestId,
      );
      res.status(upstream.status).type('application/json').send(upstream.body);
    } catch {
      deps.logger.error('calculator unavailable', { requestId });
      res.status(502).json({ error: 'calculator unavailable' });
    }
  }

  app.get('/api/calculator/value', (req, res) => {
    void proxy(req, res);
  });
  app.put('/api/calculator/value', (req, res) => {
    void proxy(req, res);
  });

  return app;
}
