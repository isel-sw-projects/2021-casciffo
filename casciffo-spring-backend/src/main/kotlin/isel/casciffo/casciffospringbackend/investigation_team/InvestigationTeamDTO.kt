package isel.casciffo.casciffospringbackend.investigation_team

import isel.casciffo.casciffospringbackend.users.user.UserDTO
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column

data class InvestigationTeamDTO (
    @Id
    @Column(value = "team_id")
    var id: Int? = null,

    var proposalId: Int? = null,
    val memberRole: InvestigatorRole? = null,
    val memberId: Int? = null,

    var member: UserDTO? = null
)