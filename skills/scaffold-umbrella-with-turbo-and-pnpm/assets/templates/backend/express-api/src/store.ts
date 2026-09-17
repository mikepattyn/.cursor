import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export type StoredValue = { value: number | null; updatedAt: string | null };

const MIGRATE = `CREATE TABLE IF NOT EXISTS calculator_value (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  value REAL NOT NULL,
  updated_at TEXT NOT NULL
)`;

export class SqliteStore {
  #db: DatabaseSync;

  constructor(path: string) {
    if (path !== ':memory:') {
      mkdirSync(dirname(path), { recursive: true });
    }
    this.#db = new DatabaseSync(path);
    this.#db.exec(MIGRATE);
  }

  ready(): boolean {
    try {
      this.#db.prepare('SELECT 1').get();
      return true;
    } catch {
      return false;
    }
  }

  get(): StoredValue {
    const row = this.#db
      .prepare('SELECT value, updated_at FROM calculator_value WHERE id = 1')
      .get() as { value: number; updated_at: string } | undefined;
    if (row == null) {
      return { value: null, updatedAt: null };
    }
    return { value: row.value, updatedAt: row.updated_at };
  }

  put(value: number): { value: number; updatedAt: string } {
    const updatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    this.#db
      .prepare(
        `INSERT INTO calculator_value (id, value, updated_at)
         VALUES (1, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           value = excluded.value,
           updated_at = excluded.updated_at`,
      )
      .run(value, updatedAt);
    return { value, updatedAt };
  }

  close(): void {
    this.#db.close();
  }
}
