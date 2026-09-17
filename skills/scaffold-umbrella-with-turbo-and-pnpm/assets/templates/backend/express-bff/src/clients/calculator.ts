import { calculatorValueUrl } from '../calculator-url.ts';

export type FetchLike = typeof fetch;

export async function proxyCalculator(
  fetchImpl: FetchLike,
  calculatorUrl: string,
  method: string,
  body: unknown,
  timeoutMs: number,
  requestId: string,
): Promise<{ status: number; body: string }> {
  const upstream = await fetchImpl(calculatorValueUrl(calculatorUrl), {
    method,
    headers: {
      'content-type': 'application/json',
      'x-request-id': requestId,
    },
    body: method === 'PUT' ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeoutMs),
  });
  return { status: upstream.status, body: await upstream.text() };
}
