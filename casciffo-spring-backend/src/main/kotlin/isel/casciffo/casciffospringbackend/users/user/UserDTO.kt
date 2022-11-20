package isel.casciffo.casciffospringbackend.users.user

import isel.casciffo.casciffospringbackend.roles.RoleModel

data class UserDTO (
    var userId : Int? = null,

    val name: String? = null,

    val email: String? = null,

    var password: String? = null,

    var roles: List<RoleModel>? = null,
)