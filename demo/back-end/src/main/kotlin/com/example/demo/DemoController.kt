package com.example.demo

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.concurrent.CompletableFuture
import java.util.concurrent.TimeUnit

@RestController()
@RequestMapping(value = ["/demo"])
class DemoController(private val demoService: DemoService) {

    @GetMapping
    fun demo() : String = "Spring Web Demo"

    @GetMapping(value = ["/helloWorld"])
    fun helloWorld() : String = "Hello World!"

    @GetMapping(value = ["/topTracks"], produces = ["application/json"])
    fun getTopTracks(@RequestParam(name = "limit", defaultValue = "50") limit: Int,
                     @RequestParam(name = "page", defaultValue = "1") page: Int,
                     @RequestParam(name = "country") country: String) : String {

        return demoService.findTopTracksByCountry(country = country, limit = limit, page = page)
    }
}
