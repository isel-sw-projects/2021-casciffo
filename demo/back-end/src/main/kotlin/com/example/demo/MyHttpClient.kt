package com.example.demo

import org.springframework.util.concurrent.SuccessCallback
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

class MyHttpClient {
    val client : HttpClient = HttpClient.newHttpClient()

    fun getRequest(url: String, onResponse: SuccessCallback<String>) {
        val req = HttpRequest.newBuilder(URI.create(url)).GET().build()
        client.sendAsync(req, HttpResponse.BodyHandlers.ofString())
            .thenApply(HttpResponse<String>::body)
            .thenAccept(onResponse::onSuccess)
    }
}