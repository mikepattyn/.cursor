package com.umbrella.example

import java.nio.file.Files
import java.nio.file.Path
import java.sql.DriverManager
import java.time.Instant
import kotlinx.serialization.Serializable

@Serializable
data class StoredValue(val value: Double?, val updatedAt: String?)

class Store(private val path: String) {
    init {
        if (path != ":memory:") {
            Files.createDirectories(Path.of(path).toAbsolutePath().parent)
        }
        connect().use { conn ->
            conn.createStatement().execute(
                """
                CREATE TABLE IF NOT EXISTS calculator_value (
                  id INTEGER PRIMARY KEY CHECK (id = 1),
                  value REAL NOT NULL,
                  updated_at TEXT NOT NULL
                )
                """.trimIndent(),
            )
        }
    }

    fun ready(): Boolean = runCatching {
        connect().use { it.createStatement().executeQuery("SELECT 1") }
    }.isSuccess

    fun get(): StoredValue {
        connect().use { conn ->
            conn.createStatement().executeQuery("SELECT value, updated_at FROM calculator_value WHERE id = 1").use { rs ->
                if (!rs.next()) {
                    return StoredValue(null, null)
                }
                return StoredValue(rs.getDouble(1), rs.getString(2))
            }
        }
    }

    fun put(value: Double): StoredValue {
        val updatedAt = Instant.now().toString().replace(Regex("\\.\\d+Z$"), "Z")
        connect().use { conn ->
            conn.prepareStatement(
                """
                INSERT INTO calculator_value (id, value, updated_at)
                VALUES (1, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  value = excluded.value,
                  updated_at = excluded.updated_at
                """.trimIndent(),
            ).use { stmt ->
                stmt.setDouble(1, value)
                stmt.setString(2, updatedAt)
                stmt.executeUpdate()
            }
        }
        return StoredValue(value, updatedAt)
    }

    private fun connect() = DriverManager.getConnection("jdbc:sqlite:$path")
}
