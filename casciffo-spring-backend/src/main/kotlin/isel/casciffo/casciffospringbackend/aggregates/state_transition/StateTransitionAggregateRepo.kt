package isel.casciffo.casciffospringbackend.aggregates.state_transition

import isel.casciffo.casciffospringbackend.common.StateType
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface StateTransitionAggregateRepo: ReactiveCrudRepository<StateTransitionAggregate, Int> {


    @Query(
        "SELECT st.*, s.state_name AS previous_state_name, ns.state_name AS new_state_name " +
        "FROM state_transition st " +
        "JOIN states s ON s.state_id = st.state_id_before " +
        "JOIN states ns ON ns.state_id = st.state_id_after " +
        "WHERE st.reference_id=:refId AND st.transition_type=:type"
    )
    fun findAllByReferenceIdAndTransitionType(refId: Int, type: StateType): Flux<StateTransitionAggregate>
}