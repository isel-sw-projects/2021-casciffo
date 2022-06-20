package isel.casciffo.casciffospringbackend.aggregates.investigation_team

import isel.casciffo.casciffospringbackend.investigation_team.InvestigatorRole
import org.springframework.data.annotation.Id

data class InvestigationTeamAggregate (
    @Id
    var id: Int? = null,

    var proposalId: Int? = null,
    var memberRole: InvestigatorRole? = null,
    var memberId: Int? = null,

    var memberName: String? = null,
    var memberEmail: String? = null
)