package isel.casciffo.casciffospringbackend.users

import isel.casciffo.casciffospringbackend.roles.Role

data class UserDTO (
    var userId : Int? = null,

    val name: String? = null,

    val email: String? = null,

    var password: String? = null,

    var roles: List<Role>? = null,
)