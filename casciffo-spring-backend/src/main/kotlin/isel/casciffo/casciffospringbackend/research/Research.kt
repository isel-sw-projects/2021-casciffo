package isel.casciffo.casciffospringbackend.research

import isel.casciffo.casciffospringbackend.proposals.Proposal
import isel.casciffo.casciffospringbackend.proposals.ResearchType
import isel.casciffo.casciffospringbackend.research.patients.Participant
import isel.casciffo.casciffospringbackend.research.patients.ResearchParticipants
import isel.casciffo.casciffospringbackend.states.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux
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

    var type: ResearchType,

    @Transient
    var state: State?,

    @Transient
    var proposal: Proposal?,

    @Transient
    var participants: Flux<Participant>?,

    @Transient
    var stateTransitions: Flux<StateTransition>?
)