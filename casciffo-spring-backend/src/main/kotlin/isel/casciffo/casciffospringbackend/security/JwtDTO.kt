package isel.casciffo.casciffospringbackend.security


data class JwtDTO(
    val token: String,
    val userId: Int,
    val userName: String,
    val roles: List<String>
)