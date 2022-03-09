package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.users.User
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table(value = "investigation_team")
class InvestigationTeam(
    @Id
    @Column(value = "team_id")
    var id: Int?,

    val proposalId: Int,
    val memberRole: InvestigatorRole,
    val memberId: Int,

    @Transient
    var member: User?
) {
    override fun toString(): String {
        return "{id:${id},proposalId:${proposalId},memberRole:${memberRole},memberId:${memberId},investigator:${member}}"
    }
}