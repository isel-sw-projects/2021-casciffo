package isel.casciffo.casciffospringbackend.exceptions

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Requested user does not exist.")
class UserNotFoundException : Exception()

@ResponseStatus(code = HttpStatus.UNAUTHORIZED, reason = "Current user doesnt have permission to access the resource.")
class NotAuthorizedException: Exception()

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Wrong user credentials.")
class InvalidUserCredentialsException : Exception()

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Proposal with given id not found.")
class NonExistentProposalException : Exception()

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Attempted State transition is invalid.")
class InvalidStateTransitionException : Exception()

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Cannot update a cancelled proposal.")
class CannotUpdateCancelledProposalException : Exception()

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Specified resource Id doesn't exist.")
class ResourceNotFoundException(msg: String): Exception(msg)

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Proposal Id requested doesn't exist.")
class ProposalNotFoundException: Exception()

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "State id doesn't exist.")
class InvalidStateException: Exception()

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "ProtocolId specified doesnt exist.")
class InvalidProtocolId: Exception()

@ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR, reason = "There was an error in Database.")
class DataBaseException: Exception()