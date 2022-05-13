package isel.casciffo.casciffospringbackend.states

import kotlinx.coroutines.flow.Flow

interface StateService {
    suspend fun findByName(stateName: String): State
    suspend fun findNextState(stateName: String): State
    suspend fun findById(stateId: Int): State
    suspend fun findAll(): Flow<State>
}