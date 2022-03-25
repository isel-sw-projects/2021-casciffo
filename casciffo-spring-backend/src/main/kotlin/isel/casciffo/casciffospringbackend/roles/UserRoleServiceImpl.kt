package isel.casciffo.casciffospringbackend.roles

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


@Service
class UserRoleServiceImpl(@Autowired private val repository: UserRoleRepository) : UserRoleService {
    override suspend fun createRole(role: String): UserRole? {
        val userRole = UserRole(null, roleName = role)
        return repository.save(userRole).awaitFirstOrNull()
    }

    override suspend fun getRoles(): Flow<UserRole> {
        return repository.findAll().asFlow()
    }
}