package isel.casciffo.casciffospringbackend.states.transitions

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface StateTransitionRepository: ReactiveCrudRepository<StateTransition, Int> {
    @Query("select st.* from state_transition st where reference_id = :referenceId order by transition_date desc")
    fun findAllByReferenceId(referenceId: Int) : Flux<StateTransition>
}