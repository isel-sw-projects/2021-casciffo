package isel.casciffo.casciffospringbackend.research

import isel.casciffo.casciffospringbackend.states.State
import isel.casciffo.casciffospringbackend.states.StateTransitions
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate

@Table("clinical_research")
data class Research (
    @Id
    @Column("research_id")
    var id: Int?,

    var proposalId: Int?,

    @Column("research_state_id")
    var stateId: Int?,

    var eudra_ct: String,

    var sampleSize: Int,

    var duration: Int,

    var cro: String,

    var startDate: LocalDate,

    var endState: LocalDate,

    var estimatedEndDate: LocalDate,

    var industry: String,

    var protocol: String,

    var initiativeBy: String,

    var phase: String,

    @Transient
    var state: State?,

    @Transient
    var stateTransitions: List<StateTransitions>?
)