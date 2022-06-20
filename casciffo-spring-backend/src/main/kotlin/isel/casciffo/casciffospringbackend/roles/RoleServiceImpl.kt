package isel.casciffo.casciffospringbackend.roles

import isel.casciffo.casciffospringbackend.exceptions.NonExistentResourceException
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class RoleServiceImpl(@Autowired private val repository: RoleRepository) : RoleService {
    override suspend fun createRole(role: Role): Role? {
        return repository.save(role).awaitSingle()
    }

    override suspend fun getRoles(): Flow<Role> {
        return repository.findAll().asFlow()
    }

    override suspend fun findById(id: Int): Role {
        return repository.findById(id).awaitSingleOrNull()
            ?: throw NonExistentResourceException("Role with id: $id doesn't exist.")
    }

    override suspend fun deleteRole(roleId: Int): Role {
        val roleToDelete = findById(roleId)
        repository.deleteById(roleId).subscribe()
        return roleToDelete
    }

    override fun findByUserId(id: Int): Flux<Role> {
        return repository.findByUserId(id)
    }

    override fun findByIdMono(id: Int): Mono<Role> {
        return repository.findById(id)
    }

    override fun findByStateId(id: Int): Flux<Role> {
        return repository.findByStateId(id)
    }
}