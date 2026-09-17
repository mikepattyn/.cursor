import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createApp } from './app.ts';
import { loadConfig } from './config.ts';
import { createLogger } from './logger.ts';

function listen(app: ReturnType<typeof createApp>): Promise<{ url: string; close: () => Promise<void> }> {
  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (address == null || typeof address === 'string') {
        throw new Error('expected tcp address');
      }
      resolve({
        url: `http://127.0.0.1:${address.port}`,
        close: () =>
          new Promise((done, reject) => {
            server.close((error) => (error ? reject(error) : done()));
          }),
      });
    });
  });
}

describe('example-bff', () => {
  const config = loadConfig({
    PORT: '3000',
    CALCULATOR_URL: 'http://calculator.test',
    UPSTREAM_TIMEOUT_MS: '50',
    LOG_LEVEL: 'silent',
  });
  const logger = createLogger('silent');

  it('returns ok from /healthz', async () => {
    const app = createApp({
      config,
      logger,
      fetchImpl: async () => new Response('{}'),
    });
    const { url, close } = await listen(app);
    try {
      const res = await fetch(`${url}/healthz`);
      assert.equal(res.status, 200);
      assert.deepEqual(await res.json(), { status: 'ok' });
    } finally {
      await close();
    }
  });

  it('proxies a successful GET', async () => {
    const app = createApp({
      config,
      logger,
      fetchImpl: async () =>
        new Response(JSON.stringify({ value: 4, updatedAt: '2026-01-01T00:00:00Z' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
    });
    const { url, close } = await listen(app);
    try {
      const res = await fetch(`${url}/api/calculator/value`);
      assert.equal(res.status, 200);
      assert.deepEqual(await res.json(), { value: 4, updatedAt: '2026-01-01T00:00:00Z' });
    } finally {
      await close();
    }
  });

  it('returns 502 when the calculator is down', async () => {
    const app = createApp({
      config,
      logger,
      fetchImpl: async () => {
        throw new Error('ECONNREFUSED');
      },
    });
    const { url, close } = await listen(app);
    try {
      const res = await fetch(`${url}/api/calculator/value`);
      assert.equal(res.status, 502);
      assert.deepEqual(await res.json(), { error: 'calculator unavailable' });
    } finally {
      await close();
    }
  });
});
