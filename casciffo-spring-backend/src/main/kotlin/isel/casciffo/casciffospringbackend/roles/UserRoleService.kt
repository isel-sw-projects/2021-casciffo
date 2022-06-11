package isel.casciffo.casciffospringbackend.roles

import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Mono

interface UserRoleService {
    suspend fun createRole(role: UserRole): UserRole?
    suspend fun getRoles() : Flow<UserRole>
    suspend fun findById(id: Int): UserRole

    fun findByIdMono(id: Int): Mono<UserRole>
}