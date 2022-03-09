package isel.casciffo.casciffospringbackend.roles

import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface UserRoleService {
    fun createRole(role: String): Mono<UserRole?>
    fun getRoles() : Flux<UserRole>
}