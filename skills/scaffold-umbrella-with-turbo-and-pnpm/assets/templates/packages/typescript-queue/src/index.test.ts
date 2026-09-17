import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MemoryBroker } from './index.ts';

describe('MemoryBroker', () => {
  it('enqueues, dequeues, and acks', async () => {
    const broker = new MemoryBroker<number>();
    const enqueued = await broker.enqueue(7);
    const job = await broker.dequeue();
    assert.equal(job?.id, enqueued.id);
    assert.equal(job?.payload, 7);
    await broker.ack(job!.id);
    assert.equal(await broker.dequeue(), undefined);
  });

  it('requeues on nack', async () => {
    const broker = new MemoryBroker<string>();
    await broker.enqueue('retry');
    const first = await broker.dequeue();
    await broker.nack(first!.id);
    const second = await broker.dequeue();
    assert.equal(second?.id, first?.id);
    assert.equal(second?.attempts, 2);
  });
});
