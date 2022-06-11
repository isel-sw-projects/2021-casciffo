package isel.casciffo.casciffospringbackend.security
//
//
//import io.jsonwebtoken.Claims
//import io.jsonwebtoken.Jws
//import io.jsonwebtoken.Jwts
//import io.jsonwebtoken.SignatureAlgorithm
//import io.jsonwebtoken.security.Keys
//import isel.casciffo.casciffospringbackend.common.dateNow
//import isel.casciffo.casciffospringbackend.common.newExpirationTime
//import isel.casciffo.casciffospringbackend.common.tokenIssuer
//import org.springframework.stereotype.Service
//import java.security.KeyPair
//
//
////ATTENTION!!!! https://gist.github.com/JaidenAshmore/79e62db39be60a6ee53c1eb1e30a9e14?permalink_comment_id=4055657#gistcomment-4055657
////current solution makes use of single service, so it's fine
////if this application ever gets scaled into a distributed architecture read link above!!
//
//@Service
//class JWTSigner {
//    val keyPair: KeyPair = Keys.keyPairFor(SignatureAlgorithm.HS512)
//
//    fun createJwt(userId: String): String {
//        return Jwts.builder()
//            .signWith(keyPair.private, SignatureAlgorithm.HS512)
//            .setSubject(userId)
//            .setIssuer(tokenIssuer)
//            .setExpiration(newExpirationTime)
//            .setIssuedAt(dateNow)
//            .compact()
//    }
//
//    /**
//     * Validate the JWT where it will throw an exception if it isn't valid.
//     */
//    fun validateJwt(jwt: String): Jws<Claims> {
//        return Jwts.parserBuilder()
//            .setSigningKey(keyPair.public)
//            .build()
//            .parseClaimsJws(jwt)
//    }
//}
