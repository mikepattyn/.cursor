package com.umbrella.example.repository;

import java.util.HashMap;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class SqliteStore {
    private final JdbcTemplate jdbc;

    public SqliteStore(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public boolean ready() {
        try {
            jdbc.queryForObject("SELECT 1", Integer.class);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public Map<String, Object> get() {
        var rows = jdbc.query(
                "SELECT value, updated_at FROM calculator_value WHERE id = 1",
                (rs, rowNum) -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("value", rs.getDouble("value"));
                    row.put("updatedAt", rs.getString("updated_at"));
                    return row;
                });
        if (rows.isEmpty()) {
            Map<String, Object> empty = new HashMap<>();
            empty.put("value", null);
            empty.put("updatedAt", null);
            return empty;
        }
        return rows.get(0);
    }

    public Map<String, Object> put(double value) {
        String updatedAt = java.time.Instant.now().toString().replaceAll("\\.\\d+Z$", "Z");
        jdbc.update(
                """
                INSERT INTO calculator_value (id, value, updated_at)
                VALUES (1, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  value = excluded.value,
                  updated_at = excluded.updated_at
                """,
                value,
                updatedAt);
        return Map.of("value", value, "updatedAt", updatedAt);
    }
}
