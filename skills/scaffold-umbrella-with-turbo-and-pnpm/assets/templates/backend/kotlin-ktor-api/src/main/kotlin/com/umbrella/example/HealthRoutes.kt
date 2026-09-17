package com.umbrella.example

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get

fun Route.healthRoutes(store: Store) {
    get("/healthz") {
        call.respond(mapOf("status" to "ok"))
    }
    get("/readyz") {
        if (!store.ready()) {
            call.respond(HttpStatusCode.ServiceUnavailable, mapOf("status" to "unavailable"))
            return@get
        }
        call.respond(mapOf("status" to "ok"))
    }
}
