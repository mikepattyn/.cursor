package com.umbrella.example.service;

import com.umbrella.example.repository.SqliteStore;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class CalculatorService {
    private final SqliteStore store;

    public CalculatorService(SqliteStore store) {
        this.store = store;
    }

    public Map<String, Object> get() {
        return store.get();
    }

    public Map<String, Object> put(double value) {
        return store.put(value);
    }
}
