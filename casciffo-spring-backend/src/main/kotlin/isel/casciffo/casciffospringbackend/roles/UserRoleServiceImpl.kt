package isel.casciffo.casciffospringbackend.roles

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


@Service
class UserRoleServiceImpl(@Autowired private val repository: UserRoleRepository) : UserRoleService {
    override fun createRole(role: String): Mono<UserRole?> {
        val userRole = UserRole(null, roleName = role)
        return repository.save(userRole).map {
            return@map it
        }
    }

    override fun getRoles(): Flux<UserRole> {
        return repository.findAll()
    }
}