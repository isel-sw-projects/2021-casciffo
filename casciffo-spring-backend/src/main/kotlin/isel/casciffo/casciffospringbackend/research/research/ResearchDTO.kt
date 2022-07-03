package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.proposals.proposal.ProposalModel
import isel.casciffo.casciffospringbackend.research.patients.Participant
import isel.casciffo.casciffospringbackend.states.state.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import java.time.LocalDate

data class ResearchDTO(
    var id: Int? = null,
    var proposalId: Int? = null,
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
    var state: State? = null,
    var proposal: ProposalModel? = null,
    var participants: List<Participant>? = null,
    var stateTransitions: List<StateTransition>? = null
)