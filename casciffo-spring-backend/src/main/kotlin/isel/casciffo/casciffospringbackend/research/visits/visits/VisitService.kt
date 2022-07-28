package isel.casciffo.casciffospringbackend.research.visits.visits

import kotlinx.coroutines.flow.Flow

interface VisitService {
    suspend fun createVisit(visit: Visit): Visit
    suspend fun updateVisit(visit: Visit) : Visit
    suspend fun getVisitsForPatient(researchId: Int, participantId: Int) : Flow<Visit>
    suspend fun getVisitsForResearch(researchId: Int) : Flow<Visit>

    suspend fun scheduleVisits(researchId: Int, patientId: Int, visits: List<Visit>): Flow<Visit>

}