package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeam
import isel.casciffo.casciffospringbackend.promoter.Promoter
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComments
import isel.casciffo.casciffospringbackend.proposals.constants.Pathology
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceType
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticArea
import isel.casciffo.casciffospringbackend.proposals.finance.Partnership
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolComments
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventModel
import isel.casciffo.casciffospringbackend.states.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import isel.casciffo.casciffospringbackend.users.UserModel
import lombok.AllArgsConstructor
import lombok.Data
import java.time.LocalDate
import java.time.LocalDateTime

@Data
@AllArgsConstructor
data class ProposalDTO (
    var id: Int? = null,

    var dateCreated: LocalDateTime?=null,
    var lastUpdated: LocalDateTime? = null,

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
    var principalInvestigator: UserModel? = null,
    var financialComponent: ProposalFinancialComponentDTO? = null,
    var investigationTeam: List<InvestigationTeam>? = listOf(),
    var stateTransitions: List<StateTransition>? = null,
    var timelineEvents: List<TimelineEventModel>? = null,
    var comments: List<ProposalComments>? = null,
)

@Data
@AllArgsConstructor
data class ProposalFinancialComponentDTO(
    var id : Int? = null,
    var proposalId: Int? = null,
    var promoterId: Int? = null,
    var financialContractId: Int? = null,
    var promoter: Promoter? = null,
    var partnerships: List<Partnership>? = null,
    var protocol: ProtocolDTO? = null
)

@Data
@AllArgsConstructor
data class ProtocolDTO(
    var id: Int? = null,
    var validatedDate: LocalDate? = null,
    var isValidated: Boolean = false,
    var financialComponentId: Int?=null,
    var comments: List<ProtocolComments>? = null
)