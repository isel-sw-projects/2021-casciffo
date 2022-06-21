package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamDTO
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsDTO
import isel.casciffo.casciffospringbackend.proposals.constants.Pathology
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceType
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticArea
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponentDTO
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventModel
import isel.casciffo.casciffospringbackend.states.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import isel.casciffo.casciffospringbackend.users.UserDTO
import java.util.Date

data class ProposalDTO (
    var id: Int? = null,

    var dateCreated: Date?=null,
    var lastUpdated: Date? = null,

    var sigla: String? = null,

    var type: ResearchType? = null,

    var stateId: Int? = null,
    var serviceTypeId: Int? = null,
    var therapeuticAreaId: Int? = null,
    var pathologyId: Int? = null,
    var principalInvestigatorId: Int? = null,
    var state : State? = null,
    var serviceType: ServiceType? = null,
    var therapeuticArea: TherapeuticArea? = null,
    var pathology: Pathology? = null,
    var principalInvestigator: UserDTO? = null,
    var financialComponent: ProposalFinancialComponentDTO? = null,
    var investigationTeam: List<InvestigationTeamDTO>? = listOf(),
    var stateTransitions: List<StateTransition>? = null,
    var timelineEvents: List<TimelineEventModel>? = null,
    var comments: List<ProposalCommentsDTO>? = null,
)