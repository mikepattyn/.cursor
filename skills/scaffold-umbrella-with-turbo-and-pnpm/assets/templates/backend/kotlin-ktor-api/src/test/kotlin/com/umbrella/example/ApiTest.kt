package com.umbrella.example

import io.ktor.client.request.get
import io.ktor.client.request.put
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.server.testing.testApplication
import java.nio.file.Files
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals

class ApiTest {
    private fun tempStore(): Store {
        val dir = Files.createTempDirectory("calc-")
        return Store(dir.resolve("calculator.db").toString())
    }

    @Test
    fun emptyGet() = testApplication {
        val store = tempStore()
        application { module(store) }
        val response = client.get("/value")
        assertEquals(HttpStatusCode.OK, response.status)
        assertContains(response.bodyAsText(), "\"value\":null")
    }

    @Test
    fun putThenGet() = testApplication {
        val store = tempStore()
        application { module(store) }
        val put = client.put("/value") {
            contentType(ContentType.Application.Json)
            setBody("""{"value":12}""")
        }
        assertEquals(HttpStatusCode.OK, put.status)
        val got = client.get("/value")
        assertContains(got.bodyAsText(), "\"value\":12")
    }

    @Test
    fun health() = testApplication {
        val store = tempStore()
        application { module(store) }
        assertEquals(HttpStatusCode.OK, client.get("/healthz").status)
        assertEquals(HttpStatusCode.OK, client.get("/readyz").status)
    }
}
