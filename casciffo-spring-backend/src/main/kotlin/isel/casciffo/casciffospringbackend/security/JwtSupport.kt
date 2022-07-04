package isel.casciffo.casciffospringbackend.security

import io.jsonwebtoken.Header
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import isel.casciffo.casciffospringbackend.common.frontEnd
import isel.casciffo.casciffospringbackend.common.newExpirationTime
import isel.casciffo.casciffospringbackend.common.tokenIssuer
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.authority.AuthorityUtils
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.time.Instant
import java.util.*

data class BearerTokenWrapper(val token: BearerToken, val userId: Int, val userName: String)

class BearerToken(val value: String) : AbstractAuthenticationToken(AuthorityUtils.NO_AUTHORITIES) {
    override fun getCredentials(): Any = value
    override fun getPrincipal(): Any = value
}

@Component
class JwtSupport {

    /**
     * Encoded with HS512
     */
    private val key =
        Keys.hmacShaKeyFor(
            "Me1yRSqMhM24sea0NuIuVhuHXBKJpKty5xpwWTw9wYJZoJuLELfDoKy73bN2tgYJP1a0fgCkIXZE493eSUot4w==".toByteArray()
        )
    private val parser = Jwts.parserBuilder().setSigningKey(key).build()

    fun generate(username: String): BearerToken {
        val builder = Jwts.builder()
            .setHeaderParam("typ", Header.JWT_TYPE)
            .setSubject(username)
            .setIssuedAt(Date())
            .setIssuer(tokenIssuer)
            .setExpiration(newExpirationTime)
            .setAudience(frontEnd)
            .signWith(key)

        return BearerToken(builder.compact())
    }

    fun getUserEmail(token: BearerToken): String {
        return parser.parseClaimsJws(token.value).body.subject
    }

    /**
     * @param user Holds the user details information used by spring security, username will have the userEmail instead
     */
    fun isValid(token: BearerToken, user: UserDetails?): Boolean {
        val claims = parser.parseClaimsJws(token.value).body
        val isNotExpired = claims.expiration.after(Date.from(Instant.now()))
        //email is currently being used in place of username, to alter see UserServiceImpl#buildUserDetails
        val doesUserEmailMatch = claims.subject == user!!.username

        return isNotExpired && doesUserEmailMatch
    }

}