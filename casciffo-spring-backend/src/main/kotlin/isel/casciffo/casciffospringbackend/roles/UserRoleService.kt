package isel.casciffo.casciffospringbackend.roles

import kotlinx.coroutines.flow.Flow
import org.springframework.boot.autoconfigure.security.SecurityProperties
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface UserRoleService {
    suspend fun createRole(role: UserRole): UserRole?
    suspend fun getRoles() : Flow<UserRole>
    suspend fun findById(id: Int): UserRole
}