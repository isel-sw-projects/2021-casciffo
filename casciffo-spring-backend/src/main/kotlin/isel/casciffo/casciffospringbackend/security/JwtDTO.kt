package isel.casciffo.casciffospringbackend.security

import lombok.Data

@Data
data class JwtDTO(
    val token: String
)