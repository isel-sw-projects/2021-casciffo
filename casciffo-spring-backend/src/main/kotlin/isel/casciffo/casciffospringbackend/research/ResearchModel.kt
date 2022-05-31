package isel.casciffo.casciffospringbackend.research

import isel.casciffo.casciffospringbackend.proposals.ProposalModel
import isel.casciffo.casciffospringbackend.proposals.ResearchType
import isel.casciffo.casciffospringbackend.research.patients.Participant
import isel.casciffo.casciffospringbackend.states.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux
import java.time.LocalDate

@Table("clinical_research")
data class ResearchModel (
    @Id
    @Column("research_id")
    var id: Int? = null,

    var proposalId: Int? = null,

    @Column("research_state_id")
    var stateId: Int? = null,

    var eudra_ct: String? = null,

    var sampleSize: Int? = null,

    var duration: Int? = null,

    var cro: String? = null,

    var startDate: LocalDate? = null,

    var endDate: LocalDate? = null,

    var estimatedEndDate: LocalDate? = null,

    var industry: String? = null,

    var protocol: String? = null,

    var initiativeBy: String? = null,

    var phase: String? = null,

    var type: ResearchType? = null,

    @Transient
    @Value("null")
    var state: State? = null,

    @Transient
    @Value("null")
    var proposal: ProposalModel? = null,

    @Transient
    @Value("null")
    var participants: Flux<Participant>? = null,

    @Transient
    @Value("null")
    var stateTransitions: Flux<StateTransition>? = null
)