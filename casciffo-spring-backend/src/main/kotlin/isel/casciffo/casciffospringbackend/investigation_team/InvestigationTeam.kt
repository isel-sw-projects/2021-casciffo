package isel.casciffo.casciffospringbackend.investigation_team

import isel.casciffo.casciffospringbackend.users.User
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table(value = "investigation_team")
data class InvestigationTeam(
    @Id
    @Column(value = "team_id")
    var id: Int? = null,

    var proposalId: Int? = null,
    val memberRole: InvestigatorRole? = null,
    val memberId: Int? = null,

    @Transient
    @Value("null")
    var member: User? = null
)