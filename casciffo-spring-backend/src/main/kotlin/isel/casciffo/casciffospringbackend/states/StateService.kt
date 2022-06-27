package isel.casciffo.casciffospringbackend.states

import isel.casciffo.casciffospringbackend.roles.Roles
import kotlinx.coroutines.flow.Flow

interface StateService {
    suspend fun findByName(stateName: String): State
    suspend fun findNextState(stateId: Int): Flow<State>
    suspend fun findById(stateId: Int): State
    suspend fun findAll(): Flow<State>
    suspend fun findStateChainByType(type: StateType): Flow<State>
    suspend fun verifyNextStateValid(originStateId: Int, nextStateId: Int, type: StateType, role: Roles)
    suspend fun isTerminalState(stateId: Int, stateType: StateType): Boolean
}