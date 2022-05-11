package isel.casciffo.casciffospringbackend.states

import isel.casciffo.casciffospringbackend.exceptions.InvalidStateException
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateTransitionException
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class StateServiceImpl(
    @Autowired val stateRepository: StateRepository
): StateService {

    override suspend fun findByName(stateName: String): State {
        return stateRepository.findByName(stateName).awaitSingle()
    }

    override suspend fun findNextState(stateName: String): State {
        val nextState = States.valueOf(stateName).getNextState() ?: throw InvalidStateTransitionException()
        return stateRepository.findByName(nextState.name).awaitSingle()
    }

    override suspend fun findById(stateId: Int): State =
        stateRepository.findById(stateId).awaitSingle() ?: throw InvalidStateException()

}