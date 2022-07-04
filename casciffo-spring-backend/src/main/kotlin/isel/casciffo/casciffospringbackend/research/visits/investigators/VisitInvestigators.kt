package isel.casciffo.casciffospringbackend.research.visits.investigators

import isel.casciffo.casciffospringbackend.users.user.UserModel
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("visit_assigned_investigators")
data class VisitInvestigators (
    @Id
    var id: Int?,

    val visitId: Int,

    val investigatorId: Int,

    @Transient
    var investigator: UserModel?
)
