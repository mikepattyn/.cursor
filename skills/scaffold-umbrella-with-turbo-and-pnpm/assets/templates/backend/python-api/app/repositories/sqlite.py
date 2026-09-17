from __future__ import annotations

import sqlite3
from datetime import datetime, timezone
from pathlib import Path

MIGRATION = Path(__file__).resolve().parents[2] / "migrations" / "001_calculator_value.sql"


class CalculatorStore:
    def __init__(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        self._path = path
        self._migrate()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self._path)
        conn.row_factory = sqlite3.Row
        return conn

    def _migrate(self) -> None:
        sql = MIGRATION.read_text()
        with self._connect() as conn:
            conn.executescript(sql)
            conn.commit()

    def get(self) -> dict[str, float | str | None]:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT value, updated_at FROM calculator_value WHERE id = 1"
            ).fetchone()
        if row is None:
            return {"value": None, "updatedAt": None}
        return {"value": row["value"], "updatedAt": row["updated_at"]}

    def put(self, value: float) -> dict[str, float | str]:
        updated_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO calculator_value (id, value, updated_at)
                VALUES (1, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  value = excluded.value,
                  updated_at = excluded.updated_at
                """,
                (value, updated_at),
            )
            conn.commit()
        return {"value": value, "updatedAt": updated_at}

    def ready(self) -> bool:
        try:
            with self._connect() as conn:
                conn.execute("SELECT 1").fetchone()
            return True
        except sqlite3.Error:
            return False
