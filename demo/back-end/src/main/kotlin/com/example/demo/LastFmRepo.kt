package com.example.demo

import org.springframework.stereotype.Repository
import org.springframework.util.concurrent.SuccessCallback

@Repository
class LastFmRepo {
    val baseUrl = "http://ws.audioscrobbler.com/2.0"
    val methodParam = "method=geo.gettoptracks"
    val countryParam = "country="
    val limitParam = "limit="
    val pageParam = "page="
    val formatParam = "format=json"
    val apiKey = "api_key=a9590836c80d1766a7248ed51819d8da"
    val client = MyHttpClient()

    fun getTopTracks(limit: Int, page: Int, country: String, onSuccessCallback: SuccessCallback<String>) {
        val url = "${baseUrl}?${apiKey}&${methodParam}&${formatParam}" +
                "&${countryParam.plus(country)}" +
                "&${limitParam.plus(limit)}" +
                "&${pageParam.plus(page)}"
        client.getRequest(url = url,onResponse = onSuccessCallback)
    }
}