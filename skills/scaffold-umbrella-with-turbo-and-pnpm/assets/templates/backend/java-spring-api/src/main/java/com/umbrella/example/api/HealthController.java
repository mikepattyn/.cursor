package com.umbrella.example.api;

import com.umbrella.example.repository.SqliteStore;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    private final SqliteStore store;

    public HealthController(SqliteStore store) {
        this.store = store;
    }

    @GetMapping("/healthz")
    public Map<String, String> healthz() {
        return Map.of("status", "ok");
    }

    @GetMapping("/readyz")
    public ResponseEntity<Map<String, String>> readyz() {
        if (!store.ready()) {
            return ResponseEntity.status(503).body(Map.of("status", "unavailable"));
        }
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
