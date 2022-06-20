package isel.casciffo.casciffospringbackend.roles

import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface RoleService {
    suspend fun createRole(role: Role): Role?
    suspend fun getRoles() : Flow<Role>
    suspend fun findById(id: Int): Role

    suspend fun deleteRole(roleId: Int): Role

    fun findByUserId(id: Int): Flux<Role>

    fun findByIdMono(id: Int): Mono<Role>

    fun findByStateId(id: Int): Flux<Role>
}