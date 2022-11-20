package isel.casciffo.casciffospringbackend.roles

import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface RoleService {
    suspend fun createRole(role: RoleModel): RoleModel?
    suspend fun getRoles() : Flow<RoleModel>
    suspend fun findById(id: Int): RoleModel

    suspend fun deleteRole(roleId: Int): RoleModel

    fun findByUserId(id: Int): Flux<RoleModel>

    fun findByIdMono(id: Int): Mono<RoleModel>

    fun findByStateId(id: Int): Flux<RoleModel>
}