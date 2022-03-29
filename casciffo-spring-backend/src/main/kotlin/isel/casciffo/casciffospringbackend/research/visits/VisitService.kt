package isel.casciffo.casciffospringbackend.research.visits

import kotlinx.coroutines.flow.Flow

interface VisitService {
    //change to visitResource
    suspend fun createVisit(visit: Visit): Visit
    suspend fun updateVisit(visit: Visit) : Visit
    suspend fun getVisitsForPatient(participantId: Int) : Flow<Visit>
    suspend fun getVisitsForResearch(researchId: Int) : Flow<Visit>
}