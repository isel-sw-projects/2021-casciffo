package isel.casciffo.casciffospringbackend.states

data class StateCoreInfo(
    val id: Int? = null,
    val stateName: String? = null
)

data class StateDTO (
    val id: Int? = null,
    val stateName: String? = null,
    val nextInChain: List<StateCoreInfo>? = null,
    val roles: List<String> ? = null
)