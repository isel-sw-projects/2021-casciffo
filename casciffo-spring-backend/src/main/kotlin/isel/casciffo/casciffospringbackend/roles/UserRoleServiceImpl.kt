package isel.casciffo.casciffospringbackend.roles

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class UserRoleServiceImpl(@Autowired private val repository: UserRoleRepository) : UserRoleService {
    override suspend fun createRole(role: UserRole): UserRole? {
        return repository.save(role).awaitSingle()
    }

    override suspend fun getRoles(): Flow<UserRole> {
        return repository.findAll().asFlow()
    }

    override suspend fun findById(id: Int): UserRole {
        return repository.findById(id).awaitSingle()
    }

    override fun findByIdMono(id: Int): Mono<UserRole> {
        return repository.findById(id)
    }
}