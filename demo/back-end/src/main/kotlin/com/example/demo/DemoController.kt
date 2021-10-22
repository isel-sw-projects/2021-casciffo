package com.example.demo

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class DemoController {

    @GetMapping
    fun demo() : String = "Spring Web Demo"

    @GetMapping(value = ["/helloWorld"])
    fun helloWorld() : String = "Hello World!"
}