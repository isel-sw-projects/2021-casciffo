package isel.casciffo.casciffospringbackend.research.patients

import kotlinx.coroutines.flow.Flow

interface ParticipantService {
    suspend fun findAllByResearchId(researchId: Int) : Flow<ResearchPatient>
    suspend fun addParticipantToResearch(participantId: Int, researchId: Int): ResearchPatient
    suspend fun findByProcessId(pid: Long): PatientModel?
    suspend fun searchByProcessIdLike(pId: Long): Flow<PatientModel>
    suspend fun save(patient: PatientModel) : PatientModel
    suspend fun getPatientDetails(researchId: Int, patientProcessNum: Long): ResearchPatient
    suspend fun updateResearchPatients(researchId: Int, patients: List<ResearchPatient>): Flow<ResearchPatient>
    suspend fun removeParticipant(researchId: Int, patientProcessNum: Int)
}