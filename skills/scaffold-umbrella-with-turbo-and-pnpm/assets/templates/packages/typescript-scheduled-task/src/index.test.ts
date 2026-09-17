import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { exitCode, runOnce } from './index.ts';

describe('runOnce', () => {
  it('returns ok on success', async () => {
    const result = await runOnce(() => undefined);
    assert.deepEqual(result, { ok: true });
    assert.equal(exitCode(result), 0);
  });

  it('returns error on throw', async () => {
    const result = await runOnce(() => {
      throw new Error('boom');
    });
    assert.deepEqual(result, { ok: false, error: 'boom' });
    assert.equal(exitCode(result), 1);
  });
});
