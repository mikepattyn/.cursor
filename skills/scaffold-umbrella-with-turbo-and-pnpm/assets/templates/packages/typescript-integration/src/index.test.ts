import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createHttpAdapter, HttpTimeoutError } from './index.ts';

describe('createHttpAdapter', () => {
  it('prefixes the base URL', async () => {
    const adapter = createHttpAdapter({
      baseUrl: 'https://api.example',
      fetchImpl: async (input) => {
        assert.equal(String(input), 'https://api.example/value');
        return new Response('{}', { status: 200 });
      },
    });
    const res = await adapter.request('/value');
    assert.equal(res.status, 200);
  });

  it('maps abort timeouts', async () => {
    const adapter = createHttpAdapter({
      baseUrl: 'https://api.example',
      timeoutMs: 5,
      fetchImpl: async () => {
        throw new DOMException('The operation was aborted due to timeout', 'TimeoutError');
      },
    });
    await assert.rejects(() => adapter.request('/value'), HttpTimeoutError);
  });
});
