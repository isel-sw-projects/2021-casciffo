package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeam
import isel.casciffo.casciffospringbackend.proposals.constants.Pathology
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceType
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticArea
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.states.State
import isel.casciffo.casciffospringbackend.users.User
import lombok.Data

@Data
data class ProposalDTO (
    var id: Int? = null,

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
    var principalInvestigator: User? = null,
    var financialComponent: ProposalFinancialComponent? = null,
    var investigationTeam: List<InvestigationTeam>? = listOf()
)