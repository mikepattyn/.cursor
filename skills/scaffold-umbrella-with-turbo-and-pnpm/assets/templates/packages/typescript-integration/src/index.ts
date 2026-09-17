export type FetchLike = typeof fetch;

export type HttpAdapterOptions = {
  baseUrl: string;
  timeoutMs?: number;
  fetchImpl?: FetchLike;
};

export class HttpTimeoutError extends Error {
  constructor(url: string, timeoutMs: number) {
    super(`request to ${url} timed out after ${timeoutMs}ms`);
    this.name = 'HttpTimeoutError';
  }
}

export function createHttpAdapter(options: HttpAdapterOptions) {
  const baseUrl = options.baseUrl.replace(/\/$/, '');
  const timeoutMs = options.timeoutMs ?? 5000;
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    async request(path: string, init: RequestInit = {}): Promise<Response> {
      const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
      try {
        return await fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'TimeoutError') {
          throw new HttpTimeoutError(url, timeoutMs);
        }
        throw error;
      }
    },
  };
}
