package isel.casciffo.casciffospringbackend.states.transitions

import reactor.core.publisher.Flux

interface StateTransitionService {
    suspend fun newTransition(oldStateId: Int, newStateId: Int, transitionType: TransitionType, referenceId: Int): Boolean
    fun findAllByReferenceId(id: Int): Flux<StateTransition>
}
