package com.example.demo

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
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

    @GetMapping(value = ["/topTracks"], produces = ["application/json"])
    fun getTopTracks(@RequestParam(name = "limit", defaultValue = "50") limit: Int,
                     @RequestParam(name = "page", defaultValue = "1") page: Int,
                     @RequestParam(name = "country") country: String) : String {

        val result : CompletableFuture<String> = CompletableFuture()
        result.completeOnTimeout("No results were given sorry!", 5, TimeUnit.SECONDS)
        lasfFmRepo.getTopTracks(limit, page, country) {
            result.complete(it!!)
        }
        return result.get()
    }
}
