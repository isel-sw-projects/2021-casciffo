package isel.casciffo.casciffospringbackend.research.visits.investigators

import kotlinx.coroutines.flow.Flow

interface VisitInvestigatorsService {
    suspend fun findAllByVisitId(visitId: Int) : Flow<VisitInvestigators>
}