package isel.casciffo.casciffospringbackend.users

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface UserRepository : ReactiveSortingRepository<UserModel, Int> {

    @Query( "SELECT u.* " +
            "FROM user_account u " +
            "JOIN user_role ur ON ur.role_id = u.user_role_id " +
            "WHERE ur.role_name IN (:roleNameList)")
    fun findAllByRoleNameIsIn(roleNameList: List<String>): Flux<UserModel>


    @Query( "SELECT u.* " +
            "FROM user_account u " +
            "JOIN user_role ur ON ur.role_id = u.user_role_id " +
            "WHERE u.user_name LIKE :userName " +
            "AND ur.role_name IN (:roleNameList)")
    fun findAllByRoleNameIsInAndNameLike(userName: String, roleNameList: List<String>): Flux<UserModel>

    fun findByName(name: String): Mono<UserModel>
    fun findByEmail(email: String): Mono<UserModel>

}