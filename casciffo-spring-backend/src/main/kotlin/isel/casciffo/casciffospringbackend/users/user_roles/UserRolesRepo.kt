package isel.casciffo.casciffospringbackend.users.user_roles

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono

interface UserRolesRepo : ReactiveCrudRepository<UserRoles, Int> {
    fun deleteUserRolesByUserIdAndRoleIdIn(userId: Int, roleIds: List<Int>): Mono<Void>
}