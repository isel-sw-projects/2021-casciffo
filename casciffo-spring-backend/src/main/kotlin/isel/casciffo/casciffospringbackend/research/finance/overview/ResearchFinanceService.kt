package isel.casciffo.casciffospringbackend.research.finance.overview

import isel.casciffo.casciffospringbackend.research.finance.research_monetary_flow.ResearchMonetaryFlow
import isel.casciffo.casciffospringbackend.research.finance.team_monetary_flow.ResearchTeamMonetaryFlow

interface ResearchFinanceService {
    suspend fun getFinanceComponentByResearchId(researchId: Int): ResearchFinance
    suspend fun updateFinanceComponent(researchId: Int, researchFinance: ResearchFinance, isValidated: Boolean = false): ResearchFinance
    suspend fun saveMonetaryTeamFlowEntry(researchId: Int, entry: ResearchTeamMonetaryFlow): ResearchFinanceWithEntryDTO
    suspend fun saveMonetaryResearchFlowEntry(researchId: Int, entry: ResearchMonetaryFlow): ResearchFinanceWithEntryDTO
    suspend fun createResearchFinance(researchId: Int): ResearchFinance
//    suspend fun findAllMonetaryEntriesByResearchId(researchId: Int): Flow<>
}