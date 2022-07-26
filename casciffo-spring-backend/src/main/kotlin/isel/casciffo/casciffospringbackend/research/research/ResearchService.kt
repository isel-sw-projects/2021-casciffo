package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregate
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivities
import kotlinx.coroutines.flow.Flow

interface ResearchService {
    suspend fun createResearch(researchModel: ResearchModel) : ResearchModel
    suspend fun getAllResearchesByType(type: ResearchType): Flow<ResearchAggregate>
    suspend fun getResearch(researchId: Int): ResearchModel
    suspend fun updateResearch(researchModel: ResearchModel) : ResearchModel
    suspend fun createAddenda(addenda: Addenda) : Addenda
    suspend fun createStudy(study: ScientificActivities) : ScientificActivities
    suspend fun getResearchStudies(researchId: Int): Flow<ScientificActivities>
    suspend fun addParticipant(researchId: Int, participantId: Int)
}