package isel.casciffo.casciffospringbackend.research.visits

import kotlinx.coroutines.flow.Flow
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class VisitServiceImpl : VisitService {

    @Transactional
    override suspend fun createVisit(visit: Visit): Visit {
        TODO("Not yet implemented")
    }

    @Transactional
    override suspend fun updateVisit(visit: Visit): Visit {
        TODO("Not yet implemented")
    }

    override suspend fun getVisitsForPatient(participantId: Int): Flow<Visit> {
        TODO("Not yet implemented")
    }

    override suspend fun getVisitsForResearch(researchId: Int): Flow<Visit> {
        TODO("Not yet implemented")
    }
}