package com.umbrella.example.api;

import com.umbrella.example.service.CalculatorService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CalculatorController {
    private final CalculatorService service;

    public CalculatorController(CalculatorService service) {
        this.service = service;
    }

    @GetMapping("/value")
    public Map<String, Object> get() {
        return service.get();
    }

    @PutMapping("/value")
    public ResponseEntity<Map<String, Object>> put(@RequestBody Map<String, Object> body) {
        Object raw = body.get("value");
        if (!(raw instanceof Number number)) {
            return ResponseEntity.badRequest().body(Map.of("error", "invalid body"));
        }
        return ResponseEntity.ok(service.put(number.doubleValue()));
    }
}
