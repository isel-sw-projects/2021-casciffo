package isel.casciffo.casciffospringbackend.states.transitions

import isel.casciffo.casciffospringbackend.states.StateService
import isel.casciffo.casciffospringbackend.states.StateType
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class StateTransitionServiceImpl(
    @Autowired val stateTransitionRepository: StateTransitionRepository,
    @Autowired val stateService: StateService
): StateTransitionService {
    override suspend fun newTransition(
        oldStateId: Int,
        newStateId: Int,
        stateType: StateType,
        referenceId: Int
    ): Boolean {
        val stateTransition =
            StateTransition(
                null
                , oldStateId
                , newStateId
                , LocalDateTime.now()
                , stateType
                , referenceId
            )
        stateTransitionRepository.save(stateTransition).awaitFirstOrNull() ?: return false
        return true
    }

    override suspend fun findAllByReferenceId(id: Int): Flow<StateTransition> {
        return stateTransitionRepository.findAllByReferenceId(id).asFlow().map(this::loadStates)
    }

    suspend fun loadStates(transition: StateTransition) : StateTransition {
        transition.previousState = stateService.findById(transition.previousStateId!!)
        transition.newState = stateService.findById(transition.newStateId!!)
        return transition
    }
}