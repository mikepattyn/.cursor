package store

import (
	"database/sql"
	"os"
	"path/filepath"
	"time"

	_ "modernc.org/sqlite"
)

type Store struct {
	db *sql.DB
}

type Value struct {
	Value     *float64 `json:"value"`
	UpdatedAt *string  `json:"updatedAt"`
}

func Open(path string) (*Store, error) {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return nil, err
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}
	if _, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS calculator_value (
		  id INTEGER PRIMARY KEY CHECK (id = 1),
		  value REAL NOT NULL,
		  updated_at TEXT NOT NULL
		)
	`); err != nil {
		_ = db.Close()
		return nil, err
	}
	return &Store{db: db}, nil
}

func (s *Store) Close() error {
	return s.db.Close()
}

func (s *Store) Ready() error {
	return s.db.Ping()
}

func (s *Store) Get() (Value, error) {
	var value float64
	var updatedAt string
	err := s.db.QueryRow("SELECT value, updated_at FROM calculator_value WHERE id = 1").Scan(&value, &updatedAt)
	if err == sql.ErrNoRows {
		return Value{}, nil
	}
	if err != nil {
		return Value{}, err
	}
	return Value{Value: &value, UpdatedAt: &updatedAt}, nil
}

func (s *Store) Put(value float64) (Value, error) {
	updatedAt := time.Now().UTC().Format(time.RFC3339)
	if _, err := s.db.Exec(`
		INSERT INTO calculator_value (id, value, updated_at)
		VALUES (1, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
		  value = excluded.value,
		  updated_at = excluded.updated_at
	`, value, updatedAt); err != nil {
		return Value{}, err
	}
	return Value{Value: &value, UpdatedAt: &updatedAt}, nil
}
