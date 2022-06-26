package isel.casciffo.casciffospringbackend.users.user_roles

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("user_roles")
data class UserRoles (
    @Id
    var id: Int? = null,
    var userId: Int? = null,
    var roleId: Int? = null
)