package isel.casciffo.casciffospringbackend.research.addenda

import isel.casciffo.casciffospringbackend.states.StateTransitions
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("addenda")
data class Addenda (
    @Id
    @Column("addenda_id")
    var id: Int?,

    @Transient
    var stateTransitions: List<StateTransitions>?
)