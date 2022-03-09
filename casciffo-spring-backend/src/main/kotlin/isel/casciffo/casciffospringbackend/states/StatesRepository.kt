package isel.casciffo.casciffospringbackend.states

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface StatesRepository : ReactiveCrudRepository<States, Int> {
}