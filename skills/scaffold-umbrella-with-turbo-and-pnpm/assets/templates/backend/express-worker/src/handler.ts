export type Job = {
  id: string;
  type: string;
  payload: unknown;
  retryCount: number;
};

export type HandleResult =
  | { status: 'ack'; duplicate?: boolean }
  | { status: 'retry'; retryCount: number }
  | { status: 'dead' };

const processed = new Set<string>();

export function resetHandler(): void {
  processed.clear();
}

export function handle(job: Job, maxRetries = 5): HandleResult {
  if (!job.id) {
    throw new Error('job.id is required');
  }
  if (processed.has(job.id)) {
    return { status: 'ack', duplicate: true };
  }
  if (job.retryCount > maxRetries) {
    return { status: 'dead' };
  }
  if (job.retryCount > 0 && job.retryCount <= maxRetries && job.type === 'fail-once') {
    return { status: 'retry', retryCount: job.retryCount + 1 };
  }
  processed.add(job.id);
  return { status: 'ack' };
}
