package isel.casciffo.casciffospringbackend.states.transitions

import kotlinx.coroutines.flow.Flow


interface StateTransitionService {
    suspend fun newTransition(oldStateId: Int, newStateId: Int, transitionType: TransitionType, referenceId: Int): Boolean
    suspend fun findAllByReferenceId(id: Int): Flow<StateTransition>
}
