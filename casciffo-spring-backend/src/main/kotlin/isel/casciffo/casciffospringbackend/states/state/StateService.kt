package isel.casciffo.casciffospringbackend.states.state

import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.roles.Roles
import kotlinx.coroutines.flow.Flow

interface StateService {
    suspend fun findByName(stateName: String): State
    suspend fun findNextState(stateId: Int, type: StateType): Flow<State>
    suspend fun getNextProposalState(pId: Int, type: StateType): State
    suspend fun findById(stateId: Int): State
    suspend fun findAll(): Flow<State>
    suspend fun findStateChainByType(type: StateType): Flow<State>

    suspend fun findInitialStateByType(type: StateType): State

    /**
     * @throws IllegalStateException In case of invalid next state or insufficient role permissions
     */
    suspend fun verifyNextStateValid(originStateId: Int, nextStateId: Int, type: StateType, role: Roles)
    suspend fun verifyNextStateValidV2(originStateId: Int, nextStateId: Int, type: StateType, roles: List<String>)
    suspend fun isTerminalState(stateId: Int, stateType: StateType): Boolean
}