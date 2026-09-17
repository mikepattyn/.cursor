import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';
import { handle, resetHandler } from './handler.ts';

describe('handle', () => {
  beforeEach(() => {
    resetHandler();
  });

  it('acks a new job', () => {
    assert.deepEqual(handle({ id: 'job-1', type: 'echo', payload: { n: 1 }, retryCount: 0 }), { status: 'ack' });
  });

  it('is idempotent for the same job id', () => {
    handle({ id: 'job-1', type: 'echo', payload: {}, retryCount: 0 });
    assert.deepEqual(handle({ id: 'job-1', type: 'echo', payload: {}, retryCount: 0 }), {
      status: 'ack',
      duplicate: true,
    });
  });

  it('dead-letters after too many retries', () => {
    assert.deepEqual(handle({ id: 'job-2', type: 'echo', payload: {}, retryCount: 6 }), { status: 'dead' });
  });
});
