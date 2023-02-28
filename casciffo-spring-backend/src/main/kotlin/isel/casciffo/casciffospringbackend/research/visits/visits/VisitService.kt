package isel.casciffo.casciffospringbackend.research.visits.visits

import kotlinx.coroutines.flow.Flow
import org.springframework.transaction.annotation.Transactional

interface VisitService {
    @Transactional
    suspend fun createVisit(visit: VisitDTO): VisitModel
    @Transactional
    suspend fun concludeVisit(visit: VisitModel) : VisitModel
    suspend fun getVisitsForResearchPatient(researchId: Int, participantId: Int) : Flow<VisitModel>
    suspend fun getAllVisitsForPatient(participantId: Int) : Flow<VisitModel>
    suspend fun getVisitsForResearch(researchId: Int) : Flow<VisitModel>

    @Transactional
    suspend fun addPatientWithVisits(researchId: Int, patientWithVisitsDTO: PatientWithVisitsDTO): PatientWithVisitsModel
    @Transactional
    suspend fun scheduleVisits(researchId: Int, visits: List<VisitDTO>): Flow<VisitModel>
    suspend fun getVisitDetails(researchId: Int, visitId: Int): VisitModel

}