package isel.casciffo.casciffospringbackend.research.patients

import kotlinx.coroutines.flow.Flow
import org.springframework.transaction.annotation.Transactional

interface ParticipantService {
    suspend fun findAll(): Flow<PatientModel>
    suspend fun findByProcessId(pid: Long): PatientModel?
    suspend fun searchByProcessIdLike(pId: Long): Flow<PatientModel>
    @Transactional
    suspend fun save(patient: PatientModel) : PatientModel
    @Transactional
    suspend fun deletePatient(patientId: Int): PatientModel?
    suspend fun findAllByResearchId(researchId: Int) : Flow<ResearchPatient>
    suspend fun addParticipantToResearch(participantId: Int, researchId: Int): ResearchPatient
    suspend fun getResearchPatientDetails(researchId: Int, patientProcessNum: Long): ResearchPatient
    @Transactional
    suspend fun updateResearchPatients(researchId: Int, patients: List<ResearchPatient>): Flow<ResearchPatient>
    suspend fun removeParticipant(researchId: Int, patientProcessNum: Int)
    @Transactional
    suspend fun updatePatient(patientId: Int, patientModel: PatientModel): PatientModel
    suspend fun getPatientDetails(patientId: Int): PatientModel
}