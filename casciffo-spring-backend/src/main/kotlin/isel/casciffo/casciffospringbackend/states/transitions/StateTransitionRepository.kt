package isel.casciffo.casciffospringbackend.states.transitions

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface StateTransitionRepository: ReactiveCrudRepository<StateTransition, Int> {
}