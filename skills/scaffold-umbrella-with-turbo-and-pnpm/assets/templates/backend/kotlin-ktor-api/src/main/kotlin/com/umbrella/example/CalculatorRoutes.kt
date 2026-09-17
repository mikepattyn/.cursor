package com.umbrella.example

import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.put
import kotlinx.serialization.Serializable

@Serializable
data class ValueBody(val value: Double)

fun Route.calculatorRoutes(store: Store) {
    get("/value") {
        call.respond(store.get())
    }
    put("/value") {
        val body = runCatching { call.receive<ValueBody>() }.getOrNull()
        if (body == null || !body.value.isFinite()) {
            call.respond(HttpStatusCode.BadRequest, mapOf("error" to "invalid body"))
            return@put
        }
        call.respond(store.put(body.value))
    }
}
