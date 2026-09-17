package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	SQLitePath string
	Port       int
}

func Load() (Config, error) {
	path := os.Getenv("SQLITE_PATH")
	if path == "" {
		path = "/data/calculator.db"
	}
	port := 8081
	if raw := os.Getenv("PORT"); raw != "" {
		parsed, err := strconv.Atoi(raw)
		if err != nil || parsed < 1 || parsed > 65535 {
			return Config{}, fmt.Errorf("PORT must be 1-65535, got %s", raw)
		}
		port = parsed
	}
	return Config{SQLitePath: path, Port: port}, nil
}
