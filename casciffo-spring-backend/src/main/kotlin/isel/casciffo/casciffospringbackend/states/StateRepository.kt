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

    @Query(
        "SELECT CASE WHEN COUNT(S) > 0 THEN TRUE ELSE FALSE END " +
        "FROM states S " +
        "JOIN next_possible_states nps on S.state_id = nps.next_state_id " +
        "WHERE nps.origin_state_id=:originStateId AND nps.next_state_id=:nextStateId AND nps.state_type=:stateType"
    )
    fun existsNextStateForStateAndType(originStateId: Int, nextStateId: Int, stateType: StateType): Mono<Boolean>

    @Query(
        "SELECT CASE WHEN COUNT(S) > 0 THEN TRUE ELSE FALSE END " +
        "FROM states S " +
        "JOIN next_possible_states nps on S.state_id = nps.origin_state_id " +
        "WHERE nps.origin_state_id=:stateId AND nps.state_type=:stateType AND nps.is_terminal_state IS TRUE"
    )
    fun isTerminalState(stateId: Int, stateType: StateType): Mono<Boolean>
}