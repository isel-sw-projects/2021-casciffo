package com.example.demo

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.concurrent.CompletableFuture
import java.util.concurrent.TimeUnit

@Service
class DemoService(val repo: LastFmRepo) {

    fun findTopTracksByCountry(country: String, limit: Int, page: Int): String {
        val result : CompletableFuture<String> = CompletableFuture()
        result.completeOnTimeout("No results were given sorry!", 5, TimeUnit.SECONDS)
        repo.getTopTracks(limit, page, country) {
            result.complete(it!!)
        }
        return result.get()
    }
}