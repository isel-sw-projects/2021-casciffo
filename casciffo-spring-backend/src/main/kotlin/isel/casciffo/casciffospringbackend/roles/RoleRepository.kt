package isel.casciffo.casciffospringbackend.roles

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface RoleRepository : ReactiveCrudRepository<Role, Int>{
    @Query("select r.* from roles r" +
            " join user_roles ur on r.role_id = ur.role_id" +
            " where ur.user_id = :userId")
    fun findByUserId(userId: Int) : Flux<Role>

    @Query("SELECT r.* " +
            "FROM roles r " +
            "JOIN state_roles sr " +
            "ON r.role_id = sr.role_id " +
            "WHERE sr.state_id = :id")
    fun findByStateId(id: Int): Flux<Role>
}