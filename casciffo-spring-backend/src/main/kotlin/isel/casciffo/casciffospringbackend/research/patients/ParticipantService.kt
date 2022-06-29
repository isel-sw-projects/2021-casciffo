package isel.casciffo.casciffospringbackend.research.patients

import kotlinx.coroutines.flow.Flow

interface ParticipantService {
    suspend fun getParticipantsByResearchId(researchId: Int) : Flow<Participant>
    suspend fun addParticipantToResearch(participantId: Int, researchId: Int): Participant
    suspend fun findByProcessId(pid: Int): Participant?
    suspend fun save(participant: Participant) : Participant
}