package isel.casciffo.casciffospringbackend.states

import isel.casciffo.casciffospringbackend.exceptions.InvalidStateException
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateTransitionException
import isel.casciffo.casciffospringbackend.roles.UserRoleService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class StateServiceImpl(
    @Autowired val stateRepository: StateRepository,
    @Autowired val userRoleService: UserRoleService
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

    override suspend fun findAll(): Flow<State> {
        return stateRepository.findAll().asFlow().map(this::loadRole)
    }

    suspend fun loadRole(state: State): State {
        state.owner = userRoleService.findById(state.ownerId)
        return state
    }
}