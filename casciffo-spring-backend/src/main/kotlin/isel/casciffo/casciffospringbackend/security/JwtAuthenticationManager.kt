package isel.casciffo.casciffospringbackend.security

import isel.casciffo.casciffospringbackend.exceptions.InvalidBearerTokenException
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.ReactiveUserDetailsService
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono

@Component
class JwtAuthenticationManager(
    private val jwtSupport: JwtSupport,
    private val users: ReactiveUserDetailsService
) : ReactiveAuthenticationManager {

    override fun authenticate(authentication: Authentication?): Mono<Authentication> {
        return Mono.justOrEmpty(authentication)
            .filter { auth -> auth is BearerToken }
            .cast(BearerToken::class.java)
            .flatMap { jwt -> mono { validate(jwt) } }
            .onErrorMap { error -> InvalidBearerTokenException(error.message) }
    }

    private suspend fun validate(token: BearerToken): Authentication {
        val username = jwtSupport.getUserEmail(token)
        val user = users.findByUsername(username).awaitSingleOrNull()

        if (jwtSupport.isValid(token, user)) {
            return UsernamePasswordAuthenticationToken(user!!.username, user.password, user.authorities)
        }

        throw IllegalArgumentException("Token is not valid.")
    }

}