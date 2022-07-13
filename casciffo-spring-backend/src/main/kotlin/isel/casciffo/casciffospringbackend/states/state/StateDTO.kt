package isel.casciffo.casciffospringbackend.states.state

import isel.casciffo.casciffospringbackend.common.StateFlowType

data class StateCoreInfo(
    val id: Int? = null,
    val name: String? = null
)

data class StateDTO (
    val id: Int? = null,
    val name: String? = null,
    val nextInChain: List<StateCoreInfo>? = null,
    val roles: List<String> ? = null,
    val stateFlowType: StateFlowType? = null
)