package isel.casciffo.casciffospringbackend.states.transitions

import isel.casciffo.casciffospringbackend.states.State
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("state_transition")
data class StateTransition(
    @Id
    var id: Int?,

    @Column("state_id_before")
    var stateBeforeId: Int?,

    @Column("state_id_after")
    var newStateId: Int?,

    @CreatedDate
    var transitionDate: LocalDateTime,

    var transitionType: TransitionType,

    var referenceId: Int,

    @Transient
    @Value("null")
    var stateBefore: State? = null,

    @Transient
    @Value("null")
    var stateAfter: State? = null
)
