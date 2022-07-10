package isel.casciffo.casciffospringbackend.exceptions

class GenericException(
    private val reason: String,
    private val status: Int
): Exception(reason) {

    override fun toString(): String {
        return "{" +
                "\"reason\": \"$reason\"," +
                "\"status\":$status" +
                "}"
    }
}
