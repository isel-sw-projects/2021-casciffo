package isel.casciffo.casciffospringbackend.exceptions

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Requested user does not exist.")
class UserNotFoundException : Exception()