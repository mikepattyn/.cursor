import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { createApp } from './app.ts';
import { createLogger } from './logger.ts';
import { SqliteStore } from './store.ts';

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

function makeApp(): { app: ReturnType<typeof createApp>; store: SqliteStore } {
  const dir = mkdtempSync(join(tmpdir(), 'calc-'));
  const store = new SqliteStore(join(dir, 'calculator.db'));
  const app = createApp({ store, logger: createLogger('silent') });
  return { app, store };
}

describe('example-calculator-api', () => {
  it('returns empty GET /value', async () => {
    const { app, store } = makeApp();
    const { url, close } = await listen(app);
    try {
      const res = await fetch(`${url}/value`);
      assert.equal(res.status, 200);
      assert.deepEqual(await res.json(), { value: null, updatedAt: null });
    } finally {
      await close();
      store.close();
    }
  });

  it('puts then reads a value', async () => {
    const { app, store } = makeApp();
    const { url, close } = await listen(app);
    try {
      const put = await fetch(`${url}/value`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ value: 12 }),
      });
      assert.equal(put.status, 200);
      const body = (await put.json()) as { value: number; updatedAt: string };
      assert.equal(body.value, 12);
      assert.ok(body.updatedAt);
      const got = await fetch(`${url}/value`);
      assert.equal((await got.json() as { value: number }).value, 12);
    } finally {
      await close();
      store.close();
    }
  });

  it('returns ok from /healthz and /readyz', async () => {
    const { app, store } = makeApp();
    const { url, close } = await listen(app);
    try {
      const health = await fetch(`${url}/healthz`);
      assert.equal(health.status, 200);
      assert.deepEqual(await health.json(), { status: 'ok' });
      const ready = await fetch(`${url}/readyz`);
      assert.equal(ready.status, 200);
      assert.deepEqual(await ready.json(), { status: 'ok' });
    } finally {
      await close();
      store.close();
    }
  });
});
