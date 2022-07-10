package isel.casciffo.casciffospringbackend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Profile

@SpringBootApplication
class CasciffoSpringBackendApplication


fun main(args: Array<String>) {
	runApplication<CasciffoSpringBackendApplication>(*args)
}