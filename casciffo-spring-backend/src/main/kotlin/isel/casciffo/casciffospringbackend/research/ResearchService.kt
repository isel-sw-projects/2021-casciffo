package isel.casciffo.casciffospringbackend.research

import isel.casciffo.casciffospringbackend.proposals.ResearchType
import kotlinx.coroutines.flow.Flow

interface ResearchService {
    suspend fun createResearch(research: Research) : Research
    suspend fun getAllResearchesByType(type: ResearchType): Flow<Research>
    suspend fun getResearch(researchId: Int): Research
    suspend fun updateResearch(research: Research) : Research
}