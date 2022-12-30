package isel.casciffo.casciffospringbackend.exceptions

import mu.KotlinLogging
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.dao.DataAccessResourceFailureException
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
    fun handleFailedConnection(ex: DataAccessResourceFailureException, rsp: ServerHttpResponse)
    {
        println()
        println(ex)
        println(rsp)
    }

    @ExceptionHandler(ResponseStatusException::class)
    @ResponseBody
    suspend fun handleResponseStatus(ex: ResponseStatusException, req: ServerHttpRequest, rsp: ServerHttpResponse): GenericExceptionDTO {

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
        return exDTO
//        val bytes: ByteArray = exDTO.toString().toByteArray(StandardCharsets.UTF_8)
//        val buffer: DataBuffer = rsp.bufferFactory().wrap(bytes)
//        return rsp.writeWith(Flux.just(buffer)).doOnError { logger.error { it } }
    }
}