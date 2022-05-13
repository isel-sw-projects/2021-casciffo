package isel.casciffo.casciffospringbackend.states.transitions

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import java.time.LocalDateTime

@Service
class StateTransitionServiceImpl(
    @Autowired val stateTransitionRepository: StateTransitionRepository
): StateTransitionService {
    override suspend fun newTransition(
        oldStateId: Int,
        newStateId: Int,
        transitionType: TransitionType,
        referenceId: Int
    ): Boolean {
        val stateTransition =
            StateTransition(
                null
                , oldStateId
                , newStateId
                , LocalDateTime.now()
                , transitionType
                , referenceId
            )
        stateTransitionRepository.save(stateTransition).awaitFirstOrNull() ?: return false
        return true
    }

    override suspend fun findAllByReferenceId(id: Int): Flow<StateTransition> {
        return stateTransitionRepository.findAllByReferenceId(id).asFlow()
    }
}