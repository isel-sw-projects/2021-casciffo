package isel.casciffo.casciffospringbackend.users


import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface UserService {

    fun getAllUsers() : Flux<User?>
    fun getUser(id: Int) : Mono<User?>
    fun createUser(user: User) : Mono<User?>
}