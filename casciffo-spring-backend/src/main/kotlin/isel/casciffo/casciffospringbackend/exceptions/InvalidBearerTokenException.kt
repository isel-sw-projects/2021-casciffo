package isel.casciffo.casciffospringbackend.exceptions

import org.springframework.security.core.AuthenticationException

class InvalidBearerTokenException(message: String?) : AuthenticationException(message)
