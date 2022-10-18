package isel.casciffo.casciffospringbackend.research.finance.clinical_trial.overview

import isel.casciffo.casciffospringbackend.research.finance.clinical_trial.monetary_flow.ResearchMonetaryFlow
import isel.casciffo.casciffospringbackend.research.finance.team.ResearchTeamMonetaryFlow
import java.util.concurrent.Flow

interface ResearchFinanceService {
    suspend fun getFinanceComponentByResearchId(researchId: Int): ResearchFinance
    suspend fun updateFinanceComponent(researchId: Int, researchFinance: ResearchFinance): ResearchFinance
    suspend fun saveMonetaryTeamFlowEntry(researchId: Int, entry: ResearchTeamMonetaryFlow): ResearchFinance
    suspend fun saveMonetaryResearchFlowEntry(researchId: Int, entry: ResearchMonetaryFlow): ResearchFinance
    suspend fun createResearchFinance(researchId: Int): ResearchFinance
//    suspend fun findAllMonetaryEntriesByResearchId(researchId: Int): Flow<>
}