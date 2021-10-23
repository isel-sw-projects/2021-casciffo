package com.example.demo

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.concurrent.CompletableFuture
import java.util.concurrent.TimeUnit

@RestController()
@RequestMapping(value = ["/demo"])
class DemoController {
    val lasfFmRepo = LastFmRepo()

    @GetMapping
    fun demo() : String = "Spring Web Demo"

    @GetMapping(value = ["/helloWorld"])
    fun helloWorld() : String = "Hello World!"

    @GetMapping(value = ["/toptracks"], produces = ["application/json"])
    fun getTopTracks() : String {
        val result : CompletableFuture<String> = CompletableFuture()
        result.completeOnTimeout("No results were given sorry!", 5, TimeUnit.SECONDS)
        lasfFmRepo.getTopTracks(2, 1, "Portugal") {
            result.complete(it!!)
        }
        return result.get()
    }
}
