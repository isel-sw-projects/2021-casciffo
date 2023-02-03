package isel.casciffo.casciffospringbackend.exceptions

import mu.KotlinLogging
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.dao.DataAccessResourceFailureException
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.nio.charset.StandardCharsets

@RestControllerAdvice
class GlobalExceptionController {

    val logger = KotlinLogging.logger {  }
    @ExceptionHandler(DataAccessResourceFailureException::class)
    fun handleFailedConnection(
        ex: DataAccessResourceFailureException,
        req: ServerHttpRequest,
        rsp: ServerHttpResponse
    ): GenericExceptionDTO {
        val exDTO = GenericExceptionDTO(
            path = req.path.toString(),
            uri = req.uri.toString(),
            reason = "Internal Error",
            status = 500
        )
        logger.error { exDTO }

        rsp.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        rsp.headers.contentType = MediaType.APPLICATION_JSON
        return exDTO
    }

    @ExceptionHandler(ResponseStatusException::class)
    suspend fun handleResponseStatus(
        ex: ResponseStatusException,
        req: ServerHttpRequest,
        rsp: ServerHttpResponse
    ): GenericExceptionDTO {

        val exDTO = GenericExceptionDTO(
            path = req.path.toString(),
            uri = req.uri.toString(),
            reason = ex.reason ?: "Internal Error",
            status = ex.rawStatusCode
        )
        logger.error { exDTO }

        rsp.statusCode = ex.status
        rsp.headers.contentType = MediaType.APPLICATION_JSON
        return exDTO
    }
}