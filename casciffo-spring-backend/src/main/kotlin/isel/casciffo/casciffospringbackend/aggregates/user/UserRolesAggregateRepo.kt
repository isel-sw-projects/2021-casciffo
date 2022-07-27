package isel.casciffo.casciffospringbackend.aggregates.user

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface UserRolesAggregateRepo: ReactiveCrudRepository<UserRolesAggregate, Int> {

    @Query(
        "SELECT ua.user_id, ua.user_name, ua.user_email, ua.user_password, r.role_id, r.role_name " +
        "FROM user_account ua " +
        "LEFT JOIN user_roles ur on ua.user_id = ur.user_id " +
        "LEFT JOIN roles r on ur.role_id = r.role_id " +
        "WHERE ua.user_id=:userId"
    )
    fun findByUserId(userId: Int): Flux<UserRolesAggregate>

    @Query(
        "SELECT ua.user_id, ua.user_name, ua.user_email, ua.user_password, r.role_id, r.role_name " +
        "FROM user_account ua " +
        "LEFT JOIN user_roles ur on ua.user_id = ur.user_id " +
        "LEFT JOIN roles r on ur.role_id = r.role_id " +
        "WHERE ua.user_email=:userEmail"
    )
    fun findByUserEmail(userEmail: String): Flux<UserRolesAggregate>

    @Query(
        "SELECT ua.user_id, ua.user_name, ua.user_email, ua.user_password, r.role_id, r.role_name " +
        "FROM user_account ua " +
        "LEFT JOIN user_roles ur on ua.user_id = ur.user_id " +
        "LEFT JOIN roles r on ur.role_id = r.role_id "
    )
    fun findAllUsersAndRoles(): Flux<UserRolesAggregate>
}