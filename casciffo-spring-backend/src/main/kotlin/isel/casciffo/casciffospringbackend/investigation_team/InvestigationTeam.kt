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
    var id: Int?,

    var proposalId: Int,
    val memberRole: InvestigatorRole,
    val memberId: Int,

    @Transient
    @Value("null")
    var member: User?
)