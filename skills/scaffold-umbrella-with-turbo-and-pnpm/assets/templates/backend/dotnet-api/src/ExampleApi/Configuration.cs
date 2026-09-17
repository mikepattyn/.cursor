namespace ExampleApi;

public sealed record AppConfig(string SqlitePath)
{
    public static AppConfig FromEnvironment()
    {
        var path = Environment.GetEnvironmentVariable("SQLITE_PATH") ?? "/data/calculator.db";
        if (string.IsNullOrWhiteSpace(path))
        {
            throw new InvalidOperationException("SQLITE_PATH must be a non-empty path");
        }

        return new AppConfig(path);
    }
}

public sealed class CalculatorStore
{
    private readonly string _path;

    public CalculatorStore(AppConfig config)
    {
        _path = config.SqlitePath;
        var directory = Path.GetDirectoryName(Path.GetFullPath(_path));
        if (!string.IsNullOrEmpty(directory))
        {
            Directory.CreateDirectory(directory);
        }

        using var connection = Open();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = """
            CREATE TABLE IF NOT EXISTS calculator_value (
              id INTEGER PRIMARY KEY CHECK (id = 1),
              value REAL NOT NULL,
              updated_at TEXT NOT NULL
            );
            """;
        cmd.ExecuteNonQuery();
    }

    public bool Ready()
    {
        try
        {
            using var connection = Open();
            using var cmd = connection.CreateCommand();
            cmd.CommandText = "SELECT 1";
            cmd.ExecuteScalar();
            return true;
        }
        catch (Microsoft.Data.Sqlite.SqliteException)
        {
            return false;
        }
    }

    public object Get()
    {
        using var connection = Open();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = "SELECT value, updated_at FROM calculator_value WHERE id = 1";
        using var reader = cmd.ExecuteReader();
        if (!reader.Read())
        {
            return new { value = (double?)null, updatedAt = (string?)null };
        }

        return new { value = reader.GetDouble(0), updatedAt = reader.GetString(1) };
    }

    public object Put(double value)
    {
        var updatedAt = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
        using var connection = Open();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = """
            INSERT INTO calculator_value (id, value, updated_at)
            VALUES (1, $value, $updatedAt)
            ON CONFLICT(id) DO UPDATE SET
              value = excluded.value,
              updated_at = excluded.updated_at;
            """;
        cmd.Parameters.AddWithValue("$value", value);
        cmd.Parameters.AddWithValue("$updatedAt", updatedAt);
        cmd.ExecuteNonQuery();
        return new { value, updatedAt };
    }

    private Microsoft.Data.Sqlite.SqliteConnection Open()
    {
        var connection = new Microsoft.Data.Sqlite.SqliteConnection($"Data Source={_path}");
        connection.Open();
        return connection;
    }
}
