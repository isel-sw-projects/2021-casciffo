package isel.casciffo.casciffospringbackend.states

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface StateRepository : ReactiveCrudRepository<State, Int> {
    fun findByName(name: String) : Mono<State>

    @Query(
        "SELECT NS.* " +
        "FROM states S " +
        "JOIN next_possible_states NS " +
        "ON S.state_id = NS.origin_state_id"
    )
    fun findNextStatesById(stateId: Int): Flux<State>
}