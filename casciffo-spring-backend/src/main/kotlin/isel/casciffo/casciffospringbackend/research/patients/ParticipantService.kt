package isel.casciffo.casciffospringbackend.research.patients

import kotlinx.coroutines.flow.Flow

interface ParticipantService {
    suspend fun findAllByResearchId(researchId: Int) : Flow<Patient>
    suspend fun addParticipantToResearch(participantId: Int, researchId: Int): Patient
    suspend fun findByProcessId(pid: Int): Patient?
    suspend fun save(patient: Patient) : Patient
}