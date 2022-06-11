package isel.casciffo.casciffospringbackend.security

import org.springframework.security.core.AuthenticationException

class InvalidBearerToken(message: String?) : AuthenticationException(message)
