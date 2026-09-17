export type SqlParams = ReadonlyArray<string | number | null>;

export type SqliteAdapter = {
  get<T = Record<string, unknown>>(sql: string, params?: SqlParams): Promise<T | undefined>;
  all<T = Record<string, unknown>>(sql: string, params?: SqlParams): Promise<T[]>;
  run(sql: string, params?: SqlParams): Promise<void>;
};

export class MemoryAdapter implements SqliteAdapter {
  #rows = new Map<string, Record<string, unknown>>();

  async get<T = Record<string, unknown>>(sql: string, params: SqlParams = []): Promise<T | undefined> {
    if (/from calculator_value/i.test(sql) && /id\s*=/i.test(sql)) {
      return this.#rows.get('1') as T | undefined;
    }
    if (params[0] != null) {
      return this.#rows.get(String(params[0])) as T | undefined;
    }
    return undefined;
  }

  async all<T = Record<string, unknown>>(sql: string): Promise<T[]> {
    if (/from calculator_value/i.test(sql)) {
      return [...this.#rows.values()] as T[];
    }
    return [];
  }

  async run(sql: string, params: SqlParams = []): Promise<void> {
    if (/insert into calculator_value/i.test(sql)) {
      const value = params[0];
      const updatedAt = params[1];
      this.#rows.set('1', { value, updatedAt });
    }
  }
}
