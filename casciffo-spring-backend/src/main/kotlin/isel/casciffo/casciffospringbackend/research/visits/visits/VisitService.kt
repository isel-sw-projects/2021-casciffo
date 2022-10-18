package isel.casciffo.casciffospringbackend.research.visits.visits

import kotlinx.coroutines.flow.Flow

interface VisitService {
    suspend fun createVisit(visit: VisitModel): VisitModel
    suspend fun concludeVisit(visit: VisitModel) : VisitModel
    suspend fun getVisitsForPatient(researchId: Int, participantId: Int) : Flow<VisitModel>
    suspend fun getVisitsForResearch(researchId: Int) : Flow<VisitModel>

    suspend fun scheduleVisits(researchId: Int, patientId: Int, visits: List<VisitDTO>): Flow<VisitModel>
    suspend fun getVisitDetails(researchId: Int, visitId: Int): VisitModel

}