import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createCalculatorClient } from './index.ts';

describe('createCalculatorClient', () => {
  it('loads a stored value from a configurable base URL', async () => {
    const client = createCalculatorClient({
      baseUrl: 'https://device.example/api',
      fetchImpl: async (input) => {
        assert.equal(String(input), 'https://device.example/api/calculator/value');
        return new Response(JSON.stringify({ value: 8, updatedAt: '2026-01-01T00:00:00Z' }));
      },
    });
    assert.equal(await client.loadStoredValue(), 8);
  });

  it('treats persist failures as non-blocking', async () => {
    const client = createCalculatorClient({
      fetchImpl: async () => {
        throw new Error('offline');
      },
    });
    assert.equal(await client.persistValue(3), false);
  });
});
