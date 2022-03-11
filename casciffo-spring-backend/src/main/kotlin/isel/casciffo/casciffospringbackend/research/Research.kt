package isel.casciffo.casciffospringbackend.research

import isel.casciffo.casciffospringbackend.states.StateTransitions
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("clinical_research")
data class Research (
    @Id
    @Column("research_id")
    var id: Int?,

    @Transient
    var stateTransitions: List<StateTransitions>?
)