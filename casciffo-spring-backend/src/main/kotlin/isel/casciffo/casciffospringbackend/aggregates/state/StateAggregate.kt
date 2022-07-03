package isel.casciffo.casciffospringbackend.aggregates.state

import isel.casciffo.casciffospringbackend.common.StateFlowType
import org.springframework.data.annotation.Id

data class StateAggregate(
    @Id
    val stateId: Int? = null,
    val stateName: String? = null,
    val nextStateId: Int? = null,
    val nextStateName: String? = null,
    val roleName: String? = null,
    val stateFlowType: StateFlowType? = null
)
