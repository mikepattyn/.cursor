export type StoredValue = { value: number | null; updatedAt: string | null };

export type FetchLike = typeof fetch;

export type CalculatorClientOptions = {
  baseUrl?: string;
  fetchImpl?: FetchLike;
};

export function createCalculatorClient(options: CalculatorClientOptions = {}) {
  const baseUrl = (options.baseUrl ?? '/api').replace(/\/$/, '');
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    async loadStoredValue(): Promise<number | null> {
      try {
        const res = await fetchImpl(`${baseUrl}/calculator/value`);
        if (!res.ok) {
          return null;
        }
        const data = (await res.json()) as StoredValue;
        return data.value;
      } catch {
        return null;
      }
    },
    async persistValue(value: number): Promise<boolean> {
      try {
        const res = await fetchImpl(`${baseUrl}/calculator/value`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ value }),
        });
        return res.ok;
      } catch {
        return false;
      }
    },
  };
}
