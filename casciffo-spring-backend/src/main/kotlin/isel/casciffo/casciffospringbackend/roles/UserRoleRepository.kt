package isel.casciffo.casciffospringbackend.roles

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRoleRepository : ReactiveCrudRepository<UserRole, Int>{

}