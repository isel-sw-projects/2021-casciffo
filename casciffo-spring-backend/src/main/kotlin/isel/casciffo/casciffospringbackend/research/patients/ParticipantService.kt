package isel.casciffo.casciffospringbackend.research.patients

import isel.casciffo.casciffospringbackend.aggregates.patients.ResearchPatientsAggregate
import kotlinx.coroutines.flow.Flow

interface ParticipantService {
    suspend fun findAllByResearchId(researchId: Int) : Flow<ResearchPatientsAggregate>
    suspend fun addParticipantToResearch(participantId: Int, researchId: Int): PatientModel
    suspend fun findByProcessId(pid: Long): PatientModel?
    suspend fun searchByProcessIdLike(pId: Long): Flow<PatientModel>
    suspend fun save(patient: PatientModel) : PatientModel
    suspend fun getPatientDetails(researchId: Int, patientProcessNum: Long): PatientModel
    suspend fun randomizeTreatmentBranches(patients: List<ResearchPatients>): Flow<ResearchPatients>
}