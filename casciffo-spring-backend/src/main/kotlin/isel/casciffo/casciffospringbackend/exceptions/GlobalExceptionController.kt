package isel.casciffo.casciffospringbackend.exceptions

import mu.KotlinLogging
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler
import org.springframework.core.annotation.Order
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.dao.DataAccessResourceFailureException
import org.springframework.http.HttpStatus
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.nio.charset.StandardCharsets

@ControllerAdvice
@Order(0)
class GlobalExceptionController: ErrorWebExceptionHandler {

    val logger = KotlinLogging.logger {  }
    @ExceptionHandler(DataAccessResourceFailureException::class)
    fun handleFailedConnection(ex: DataAccessResourceFailureException, rsp: ServerHttpResponse)
    {
        println()
        println(ex)
        println(rsp)
    }

    override fun handle(exchange: ServerWebExchange, ex: Throwable): Mono<Void> {
        logger.error { "Handling error $ex" }

        var body : String?
        var status : HttpStatus
        when (ex) {
            is DataAccessResourceFailureException -> {
//                handleDbFailedConnection(ex)
                status = HttpStatus.INTERNAL_SERVER_ERROR
                body = "{" +
                        "\"reason\": \"Db Connection error\"," +
                        "\"status\": 500" +
                        "}"
            }
            else -> {
                status = HttpStatus.INTERNAL_SERVER_ERROR
                body = null
            }
        }

        exchange.response.statusCode = status
        if(body != null) {
            val bytes: ByteArray = body.toByteArray(StandardCharsets.UTF_8)
            val buffer: DataBuffer = exchange.response.bufferFactory().wrap(bytes)
            return exchange.response.writeWith(Flux.just(buffer))
        }
        return Mono.empty()
    }
}