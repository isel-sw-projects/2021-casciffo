package isel.casciffo.casciffospringbackend.users

data class UserDTO (
    var userId : Int? = null,

    val name: String? = null,

    val email: String? = null,

    var roleId: Int? = null,
)