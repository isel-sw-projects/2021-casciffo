package isel.casciffo.casciffospringbackend.states

interface StateService {
    suspend fun findByName(stateName: String): State
    suspend fun findNextState(stateName: String): State
    suspend fun findById(stateId: Int): State
}