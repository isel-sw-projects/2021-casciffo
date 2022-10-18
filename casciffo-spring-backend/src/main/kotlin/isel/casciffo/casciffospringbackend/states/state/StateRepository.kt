package isel.casciffo.casciffospringbackend.states.state

import isel.casciffo.casciffospringbackend.common.StateFlowType
import isel.casciffo.casciffospringbackend.common.StateType
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface StateRepository : ReactiveCrudRepository<State, Int> {
    fun findByName(name: String) : Mono<State>

    @Query(
        "SELECT s.* " +
        "FROM states s " +
        "JOIN next_possible_states ns " +
        "ON s.state_id = ns.next_state_id " +
        "WHERE ns.state_type = :stateType AND ns.origin_state_id=:stateId"
    )
    fun findNextStatesByIdAndStateType(stateId: Int, stateType: StateType): Flux<State>

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
        "WHERE nps.origin_state_id=:stateId AND nps.state_type=:stateType AND nps.state_flow_type='TERMINAL' " +
                "OR s.state_name='CANCELADO' AND s.state_id = :stateId"
    )
    fun isTerminalState(stateId: Int, stateType: StateType): Mono<Boolean>


    @Query(
        "SELECT s.* " +
        "FROM states s " +
        "JOIN next_possible_states nps ON s.state_id = nps.next_state_id " +
        "JOIN proposal p ON p.state_id = nps.origin_state_id " +
        "WHERE p.proposal_id=:pId AND nps.state_type=:stateType"
    )
    fun getNextProposalStateByIdAndStateType(pId: Int, stateType: StateType): Mono<State>

    @Query(
        "SELECT s.* " +
        "FROM states s " +
        "JOIN next_possible_states nps ON s.state_id = nps.origin_state_id " +
        "WHERE nps.state_flow_type='INITAL' AND nps.state_type=:type"
    )
    fun findInitialStateByType(type: StateType): Mono<State>
}