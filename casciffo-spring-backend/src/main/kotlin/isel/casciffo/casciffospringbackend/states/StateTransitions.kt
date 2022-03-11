package isel.casciffo.casciffospringbackend.states

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("state_transitions")
data class StateTransitions (
    @Id
    @Column("id")
    var id: Int?,

    val type: TransitionType,
    val referenceId: Int,
    val previousStateId: Int,
    val newStateId: Int,

    @Column("transition_date")
    @CreatedDate
    val createdDate: LocalDateTime,

    @Transient
    var previousState: State?,

    @Transient
    var newState: State?,
)