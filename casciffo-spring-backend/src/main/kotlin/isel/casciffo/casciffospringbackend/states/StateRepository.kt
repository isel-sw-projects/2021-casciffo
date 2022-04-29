package isel.casciffo.casciffospringbackend.states

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface StateRepository : ReactiveCrudRepository<State, Int> {
    fun findByStateName(stateName: String) : State
}