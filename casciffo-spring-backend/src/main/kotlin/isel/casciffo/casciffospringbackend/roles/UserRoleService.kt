package isel.casciffo.casciffospringbackend.roles

import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface UserRoleService {
    suspend fun createRole(role: String): UserRole?
    fun getRoles() : Flux<UserRole>
}