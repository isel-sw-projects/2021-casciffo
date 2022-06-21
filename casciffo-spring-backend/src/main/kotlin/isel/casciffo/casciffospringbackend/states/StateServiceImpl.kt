package isel.casciffo.casciffospringbackend.states

import isel.casciffo.casciffospringbackend.exceptions.InvalidStateException
import isel.casciffo.casciffospringbackend.roles.RoleService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class StateServiceImpl(
    @Autowired val stateRepository: StateRepository,
    @Autowired val roleService: RoleService
): StateService {

    override suspend fun findByName(stateName: String): State {
        return stateRepository.findByName(stateName).awaitSingle()
    }

    override suspend fun findNextState(stateId: Int): Flow<State> {
        return stateRepository.findNextStatesById(stateId).asFlow()
    }

    override suspend fun findById(stateId: Int): State =
        stateRepository.findById(stateId).awaitSingle() ?: throw InvalidStateException()

    override suspend fun findAll(): Flow<State> {
        return stateRepository.findAll().asFlow().map(this::loadRelations)
    }

    suspend fun loadRelations(state: State): State {
        state.roles = roleService.findByStateId(state.id!!)
        state.nextStates = stateRepository.findNextStatesById(state.id!!)
        return state
    }
}