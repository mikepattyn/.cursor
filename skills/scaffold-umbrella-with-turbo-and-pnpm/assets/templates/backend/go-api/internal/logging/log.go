package logging

import (
	"encoding/json"
	"os"
	"time"
)

func Info(message string, fields map[string]any) {
	write("info", message, fields)
}

func Error(message string, fields map[string]any) {
	write("error", message, fields)
}

func write(level, message string, fields map[string]any) {
	payload := map[string]any{
		"ts":      time.Now().UTC().Format(time.RFC3339),
		"level":   level,
		"message": message,
	}
	for key, value := range fields {
		payload[key] = value
	}
	_ = json.NewEncoder(os.Stdout).Encode(payload)
}
