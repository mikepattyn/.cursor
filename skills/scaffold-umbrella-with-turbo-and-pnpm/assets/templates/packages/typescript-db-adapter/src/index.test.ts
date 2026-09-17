import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MemoryAdapter } from './index.ts';

describe('MemoryAdapter', () => {
  it('starts empty then upserts calculator_value', async () => {
    const db = new MemoryAdapter();
    assert.equal(await db.get('SELECT * FROM calculator_value WHERE id = 1'), undefined);
    await db.run('INSERT INTO calculator_value (id, value, updated_at) VALUES (1, ?, ?)', [4, '2026-01-01T00:00:00Z']);
    const row = await db.get<{ value: number; updatedAt: string }>(
      'SELECT * FROM calculator_value WHERE id = 1',
    );
    assert.deepEqual(row, { value: 4, updatedAt: '2026-01-01T00:00:00Z' });
  });
});
