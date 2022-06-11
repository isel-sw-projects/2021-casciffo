package isel.casciffo.casciffospringbackend.exceptions

import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.reactive.function.client.WebClientResponseException.NotFound

@ControllerAdvice
class GlobalExceptionController {
//    @ExceptionHandler(NotFound)
//            fun handle404
}