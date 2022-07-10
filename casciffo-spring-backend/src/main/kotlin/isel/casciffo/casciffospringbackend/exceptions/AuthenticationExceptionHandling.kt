package isel.casciffo.casciffospringbackend.exceptions

import org.springframework.core.io.buffer.DataBuffer
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.server.ServerAuthenticationEntryPoint
import org.springframework.security.web.server.authorization.ServerAccessDeniedHandler
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.nio.charset.StandardCharsets

private fun buildExceptionResponse(rsp: ServerHttpResponse, message: String?, status: Int?): Mono<Void> {
    if(message == null || status == null) return Mono.empty()
    rsp.headers.set("Content-Type", "application/json")
    val exception = "{" +
            "\"reason\": \"$message\"," +
            "\"status\":$status" +
            "}"
    val bytes: ByteArray = exception.toByteArray(StandardCharsets.UTF_8)
    val buffer: DataBuffer = rsp.bufferFactory().wrap(bytes)
    return rsp.writeWith(Flux.just(buffer))
}

@Component
class CustomAuthenticationEntryPoint : ServerAuthenticationEntryPoint {
    override fun commence(exchange: ServerWebExchange, ex: AuthenticationException): Mono<Void> {
        exchange.response.statusCode = HttpStatus.UNAUTHORIZED
        exchange.response.headers.set(HttpHeaders.WWW_AUTHENTICATE, "Bearer")
        val status = HttpStatus.UNAUTHORIZED.value()
        return buildExceptionResponse(exchange.response, ex.message, status )
    }
}

@Component
class CustomAuthenticationDeniedHandler: ServerAccessDeniedHandler {
    override fun handle(exchange: ServerWebExchange, denied: AccessDeniedException): Mono<Void> {
        exchange.response.statusCode = HttpStatus.FORBIDDEN
        return buildExceptionResponse(exchange.response, denied.message, HttpStatus.FORBIDDEN.value())
    }
}