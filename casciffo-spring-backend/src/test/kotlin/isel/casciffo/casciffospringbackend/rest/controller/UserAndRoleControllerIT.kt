package isel.casciffo.casciffospringbackend.rest.controller

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.reactive.server.WebTestClient

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(SpringExtension::class)
@DirtiesContext
class UserAndRoleControllerIT {

    private var webTestClient: WebTestClient? = null


    @LocalServerPort
    private val randomServerPort = 0

    @BeforeEach
    fun setup() {
        webTestClient = WebTestClient.bindToServer().baseUrl("http://localhost:$randomServerPort").build()
    }
}