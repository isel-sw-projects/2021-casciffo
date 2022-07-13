package isel.casciffo.casciffospringbackend.aggregates.user

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column

data class UserRolesAggregate(
    @Id
    var userId : Int? = null,
    var userName: String? = null,
    var userEmail: String? = null,
    var userPassword: String? = null,
    var roleId: Int?=null,
    var roleName: String?= null
)
