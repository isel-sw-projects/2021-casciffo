package isel.casciffo.casciffospringbackend.states.transitions

import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.states.state.State
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("state_transition")
data class StateTransition(
    @Id
    var id: Int? = null,

    @Column("state_id_before")
    var previousStateId: Int? = null,

    @Column("state_id_after")
    var newStateId: Int? = null,

    var transitionDate: LocalDateTime? = null,

    var transitionType: StateType? = null,

    var referenceId: Int? = null,

    @Transient
    @Value("null")
    var previousState: State? = null,

    @Transient
    @Value("null")
    var newState: State? = null
)
