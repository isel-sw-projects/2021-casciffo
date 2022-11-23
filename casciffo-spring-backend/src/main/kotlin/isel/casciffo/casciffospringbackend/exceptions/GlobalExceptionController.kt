package isel.casciffo.casciffospringbackend.exceptions

import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.awaitSingle
import mu.KotlinLogging
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler
import org.springframework.core.annotation.Order
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.dao.DataAccessResourceFailureException
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.nio.charset.StandardCharsets

@RestControllerAdvice
class GlobalExceptionController {

    val logger = KotlinLogging.logger {  }
    @ExceptionHandler(DataAccessResourceFailureException::class)
    fun handleFailedConnection(ex: DataAccessResourceFailureException, rsp: ServerHttpResponse)
    {
        println()
        println(ex)
        println(rsp)
    }

    @ExceptionHandler(ResponseStatusException::class)
    fun handleResponseStatus(ex: ResponseStatusException, req: ServerHttpRequest, rsp: ServerHttpResponse): Mono<Void> {

        //TODO EVENTUALLY ADD REQ BODY TO RESPONSE
//        val reqBody = req.body
//            .map { buffer ->
//                val bytes = ByteArray(buffer.readableByteCount())
//                buffer.read(bytes)
//                DataBufferUtils.release(buffer)
//                String(bytes, StandardCharsets.UTF_8)
//            }
//            .collectList()
//            .awaitSingle()

        val exDTO = GenericExceptionDTO(
            path = req.path.toString(),
            uri = req.uri.toString(),
            reason = ex.reason ?: "Internal Error",
            status = ex.rawStatusCode
        )

        rsp.statusCode = ex.status
        rsp.headers.contentType = MediaType.APPLICATION_JSON

        val bytes: ByteArray = exDTO.toString().toByteArray(StandardCharsets.UTF_8)
        val buffer: DataBuffer = rsp.bufferFactory().wrap(bytes)
        return rsp.writeWith(Flux.just(buffer)).doOnError { logger.error { it } }
    }
}