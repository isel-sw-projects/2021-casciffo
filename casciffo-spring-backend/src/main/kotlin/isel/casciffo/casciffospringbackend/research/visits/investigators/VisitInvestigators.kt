package isel.casciffo.casciffospringbackend.research.visits.investigators

import isel.casciffo.casciffospringbackend.users.user.UserModel
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("visit_assigned_investigators")
data class VisitInvestigators (
    @Id
    var id: Int? = null,
    var visitId: Int? = null,
    var investigatorId: Int? = null,
    @Transient
    @Value("Null")
    var investigator: UserModel? = null
)
