package isel.casciffo.casciffospringbackend.aggregates.state_transition

import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.states.state.State
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import java.time.LocalDateTime

data class StateTransitionAggregate(
    @Id
    var id: Int? = null,

    @Column("state_id_before")
    var previousStateId: Int? = null,

    @Column("state_id_after")
    var newStateId: Int? = null,

    var transitionDate: LocalDateTime? = null,

    var transitionType: StateType? = null,

    var referenceId: Int? = null,

    var previousStateName: String? = null,

    var newStateName: String? = null
)
