package isel.casciffo.casciffospringbackend.users

import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : ReactiveSortingRepository<User, Int> {
}