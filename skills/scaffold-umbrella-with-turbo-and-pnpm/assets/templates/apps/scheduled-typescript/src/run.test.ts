import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { run } from './run.ts';

describe('scheduled task', () => {
  it('exits 0 on success', async () => {
    assert.equal(await run(), 0);
  });
});
