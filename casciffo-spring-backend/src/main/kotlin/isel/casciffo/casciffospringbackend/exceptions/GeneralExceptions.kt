package isel.casciffo.casciffospringbackend.exceptions

import org.springframework.http.HttpStatus

class GenericException(
    private val reason: String?,
    private val status: Int
) {
    override fun toString(): String {
        return "{" +
                "\"reason\": \"$reason\"," +
                "\"status\":$status" +
                "}"
    }
}
