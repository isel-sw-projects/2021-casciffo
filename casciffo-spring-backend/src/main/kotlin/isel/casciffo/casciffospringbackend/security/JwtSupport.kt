package isel.casciffo.casciffospringbackend.security

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import isel.casciffo.casciffospringbackend.common.dateNow
import isel.casciffo.casciffospringbackend.common.frontEnd
import isel.casciffo.casciffospringbackend.common.newExpirationTime
import isel.casciffo.casciffospringbackend.common.tokenIssuer
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.authority.AuthorityUtils
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.time.Instant
import java.util.*

class BearerToken(val value: String) : AbstractAuthenticationToken(AuthorityUtils.NO_AUTHORITIES) {
    override fun getCredentials(): Any = value
    override fun getPrincipal(): Any = value
}

@Component
class JwtSupport {

    /**
     * Enconded with HS512
     */
    private val key =
        Keys.hmacShaKeyFor(
            "Me1yRSqMhM24sea0NuIuVhuHXBKJpKty5xpwWTw9wYJZoJuLELfDoKy73bN2tgYJP1a0fgCkIXZE493eSUot4w==".toByteArray()
        )
    private val parser = Jwts.parserBuilder().setSigningKey(key).build()

    fun generate(username: String): BearerToken {
        val builder = Jwts.builder()
            .setSubject(username)
            .setIssuedAt(dateNow)
            .setIssuer(tokenIssuer)
            .setExpiration(newExpirationTime)
            .setAudience(frontEnd)
            .signWith(key)

        return BearerToken(builder.compact())
    }

    fun getUserEmail(token: BearerToken): String {
        return parser.parseClaimsJws(token.value).body.subject
    }

    fun isValid(token: BearerToken, user: UserDetails?): Boolean {
        val claims = parser.parseClaimsJws(token.value).body
        val isNotExpired = claims.expiration.after(Date.from(Instant.now()))
        val doesUserNameMatch = claims.subject == user?.username

        return isNotExpired && doesUserNameMatch
    }

}