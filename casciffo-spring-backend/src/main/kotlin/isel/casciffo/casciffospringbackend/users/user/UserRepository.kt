package isel.casciffo.casciffospringbackend.users.user

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface UserRepository : ReactiveSortingRepository<UserModel, Int> {

    @Query(
        "SELECT u.* " +
        "FROM user_account u " +
        "JOIN user_roles ur ON ur.user_id = u.user_id " +
        "JOIN roles r ON ur.user_id = r.role_id " +
        "WHERE r.role_name IN (:roleNameList)"
    )
    fun findAllByRoleNameIsIn(roleNameList: List<String>): Flux<UserModel>


    @Query(
        "SELECT ua.* " +
        "FROM user_account ua " +
        "JOIN user_roles ur ON ua.user_id = ur.user_id " +
        "JOIN roles r ON ur.role_id = r.role_id " +
        "WHERE LOWER(ua.user_name) LIKE LOWER(:userName) AND UPPER(r.role_name) IN (:roleNameList)"
    )
    fun findAllByRoleNameIsInAndNameLike(userName: String, roleNameList: List<String>): Flux<UserModel>

    fun findByEmail(email: String): Mono<UserModel>


}