package isel.casciffo.casciffospringbackend.roles

import isel.casciffo.casciffospringbackend.exceptions.NonExistentResourceException
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class RoleServiceImpl(@Autowired private val repository: RoleRepository) : RoleService {
    override suspend fun createRole(role: RoleModel): RoleModel? {
        return repository.save(role).awaitSingle()
    }

    override suspend fun getRoles(): Flow<RoleModel> {
        return repository.findAll().asFlow()
    }

    override suspend fun findById(id: Int): RoleModel {
        return repository.findById(id).awaitSingleOrNull()
            ?: throw NonExistentResourceException("Papél com id [$id] não existe.")
    }

    override suspend fun deleteRole(roleId: Int): RoleModel {
        val roleToDelete = findById(roleId)
        repository.deleteById(roleId).subscribe()
        return roleToDelete
    }

    override fun findByUserId(id: Int): Flux<RoleModel> {
        return repository.findByUserId(id)
    }

    override fun findByIdMono(id: Int): Mono<RoleModel> {
        return repository.findById(id)
    }

    override fun findByStateId(id: Int): Flux<RoleModel> {
        return repository.findByStateId(id)
    }
}