package isel.casciffo.casciffospringbackend.exceptions



data class GenericExceptionDTO(
    var path: String? = null,
    var uri: String? = null,
    var body: String? = null,
    var reason: String? = null,
    var status: Int? = null
){

    override fun toString(): String {
        return "{" +
                "\"path\": \"$path\"," +
                "\"uri\": \"$uri\"," +
                if(body != null) "\"body\": \"$body\"," else { "" } +
                "\"reason\": \"$reason\"," +
                "\"status\":\"$status\"," +
                "\"ok\":${false}" +
                "}"
    }
}
