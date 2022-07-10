package isel.casciffo.casciffospringbackend.aggregates.state

import isel.casciffo.casciffospringbackend.common.StateType
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface StateAggregateRepo: ReactiveCrudRepository<StateAggregate, Int> {

    @Query(
        "SELECT s.state_id, s.state_name, nps.next_state_id, ns.state_name as next_state_name, r.role_name, r.role_id, nps.state_flow_type " +
        "FROM states s " +
        "JOIN next_possible_states nps on s.state_id = nps.origin_state_id " +
        "LEFT JOIN states ns on ns.state_id = nps.next_state_id " +
        "JOIN state_roles sr on s.state_id = sr.state_id " +
        "JOIN roles r on sr.role_id = r.role_id " +
        "WHERE nps.state_type=:type"
    )
    fun findStateChainByType(type: StateType) : Flux<StateAggregate>

    @Query(
        "SELECT s.state_id, s.state_name, nps.next_state_id, ns.state_name as next_state_name, r.role_name, r.role_id, nps.state_flow_type " +
        "FROM states s " +
        "LEFT JOIN next_possible_states nps on s.state_id = nps.origin_state_id " +
        "LEFT JOIN states ns on ns.state_id = nps.next_state_id " +
        "LEFT JOIN state_roles sr on s.state_id = sr.state_id " +
        "LEFT JOIN roles r on sr.role_id = r.role_id "
    )
    fun findAllStateAggregate() : Flux<StateAggregate>

    @Query(
        "SELECT s.state_id, s.state_name, nps.next_state_id, ns.state_name as next_state_name, r.role_name, r.role_id, nps.state_flow_type " +
        "FROM states s " +
        "LEFT JOIN next_possible_states nps on s.state_id = nps.origin_state_id " +
        "LEFT JOIN states ns on ns.state_id = nps.next_state_id " +
        "LEFT JOIN state_roles sr on s.state_id = sr.state_id " +
        "LEFT JOIN roles r on sr.role_id = r.role_id " +
        "WHERE nps.origin_state_id=:originStateId AND nps.next_state_id=:nextStateId AND nps.state_type=:type"
    )
    fun findAggregateBy(originStateId: Int, nextStateId: Int, type: StateType): Flux<StateAggregate>
}