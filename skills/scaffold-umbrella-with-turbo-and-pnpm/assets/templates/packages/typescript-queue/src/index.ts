export type Job<T = unknown> = {
  id: string;
  payload: T;
  attempts: number;
};

export type Broker<T = unknown> = {
  enqueue(payload: T): Promise<Job<T>>;
  dequeue(): Promise<Job<T> | undefined>;
  ack(id: string): Promise<void>;
  nack(id: string): Promise<void>;
};

export class MemoryBroker<T = unknown> implements Broker<T> {
  #pending: Job<T>[] = [];
  #inflight = new Map<string, Job<T>>();
  #seq = 0;

  async enqueue(payload: T): Promise<Job<T>> {
    this.#seq += 1;
    const job: Job<T> = { id: `job-${this.#seq}`, payload, attempts: 0 };
    this.#pending.push(job);
    return job;
  }

  async dequeue(): Promise<Job<T> | undefined> {
    const job = this.#pending.shift();
    if (!job) {
      return undefined;
    }
    job.attempts += 1;
    this.#inflight.set(job.id, job);
    return job;
  }

  async ack(id: string): Promise<void> {
    this.#inflight.delete(id);
  }

  async nack(id: string): Promise<void> {
    const job = this.#inflight.get(id);
    if (!job) {
      return;
    }
    this.#inflight.delete(id);
    this.#pending.push(job);
  }
}
