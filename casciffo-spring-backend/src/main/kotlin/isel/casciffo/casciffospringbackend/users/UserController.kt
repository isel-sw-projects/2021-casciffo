package isel.casciffo.casciffospringbackend.users

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/users")
class UserController(@Autowired val service : UserService) {

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    fun createUser(@RequestBody(required = true) user: User): Mono<User?> {
        return service.createUser(user)
    }

    @GetMapping("/{userId}")
    fun getUser(@PathVariable userId : Int): Mono<User?> {
        return service.getUser(userId)
    }

    @GetMapping()
    fun getAllUsers(): Flux<User?> {
        return service.getAllUsers()
    }
}
