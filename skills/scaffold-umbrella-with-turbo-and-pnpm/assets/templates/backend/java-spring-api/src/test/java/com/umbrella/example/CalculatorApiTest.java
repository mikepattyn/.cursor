package com.umbrella.example;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class CalculatorApiTest {
    @DynamicPropertySource
    static void sqlite(DynamicPropertyRegistry registry) throws Exception {
        var dir = Files.createTempDirectory("calc-");
        registry.add("SQLITE_PATH", () -> dir.resolve("calculator.db").toAbsolutePath().toString());
    }

    @Autowired
    MockMvc mvc;

    @Test
    void emptyGet() throws Exception {
        mvc.perform(get("/value"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value").value(org.hamcrest.Matchers.nullValue()));
    }

    @Test
    void putThenGet() throws Exception {
        mvc.perform(put("/value").contentType(MediaType.APPLICATION_JSON).content("{\"value\":12}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value").value(12));
        mvc.perform(get("/value")).andExpect(jsonPath("$.value").value(12));
    }

    @Test
    void health() throws Exception {
        mvc.perform(get("/healthz")).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("ok"));
        mvc.perform(get("/readyz")).andExpect(status().isOk());
    }
}
