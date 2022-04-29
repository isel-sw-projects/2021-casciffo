package isel.casciffo.casciffospringbackend.roles

import org.springframework.context.annotation.Role
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRoleRepository : ReactiveCrudRepository<UserRole, Int>{
    @Query("select r.* from user_role r" +
            " join user_account ua on r.role_id = ua.user_role_id" +
            " where ua.user_id = :userId")
    fun findUserRoleByUserId(userId: Int) : UserRole
}