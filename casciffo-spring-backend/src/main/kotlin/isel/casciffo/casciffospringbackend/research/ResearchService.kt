package isel.casciffo.casciffospringbackend.research

import isel.casciffo.casciffospringbackend.proposals.ResearchType
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivities
import kotlinx.coroutines.flow.Flow

interface ResearchService {
    suspend fun createResearch(research: Research) : Research
    suspend fun getAllResearchesByType(type: ResearchType): Flow<Research>
    suspend fun getResearch(researchId: Int): Research
    suspend fun updateResearch(research: Research) : Research
    suspend fun createAddenda(addenda: Addenda) : Addenda
    suspend fun createStudy(study: ScientificActivities) : ScientificActivities
    suspend fun getResearchStudies(researchId: Int): Flow<ScientificActivities>
    suspend fun addParticipant(researchId: Int, participantId: Int)
}