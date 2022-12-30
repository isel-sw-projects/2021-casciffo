package isel.casciffo.casciffospringbackend.exceptions



data class GenericExceptionDTO(
    var path: String? = null,
    var uri: String? = null,
    var reason: String? = null,
    var status: Int? = null
){

//    override fun toString(): String {
//        return "{\"body\":{" +
//                "\"path\": \"$path\"," +
//                "\"uri\": \"$uri\"," +
//                "\"body\": \"$reason\"," +
//                "\"status\":\"$status\"," +
//                "\"ok\":${false}" +
//                "}}"
//    }
}
