package isel.casciffo.casciffospringbackend.roles

import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface UserRoleService {
    suspend fun createRole(role: String): UserRole?
    suspend fun getRoles() : Flow<UserRole>
}