package isel.casciffo.casciffospringbackend.aggregates.user

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("user_roles")
data class UserRoles (
    @Id
    var id: Int? = null,
    var user_id: Int? = null,
    var role_id: Int? = null
)