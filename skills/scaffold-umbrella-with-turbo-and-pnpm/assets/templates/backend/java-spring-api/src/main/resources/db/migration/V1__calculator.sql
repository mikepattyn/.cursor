CREATE TABLE IF NOT EXISTS calculator_value (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  value REAL NOT NULL,
  updated_at TEXT NOT NULL
);
