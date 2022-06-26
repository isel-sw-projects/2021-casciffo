package isel.casciffo.casciffospringbackend.states.transitions

import isel.casciffo.casciffospringbackend.states.StateType
import kotlinx.coroutines.flow.Flow


interface StateTransitionService {
    suspend fun newTransition(oldStateId: Int, newStateId: Int, stateType: StateType, referenceId: Int): Boolean
    suspend fun findAllByReferenceId(id: Int): Flow<StateTransition>
}
