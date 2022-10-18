package isel.casciffo.casciffospringbackend.research.finance.clinical_trial.overview

import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_FINANCE
import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_FINANCE_RESEARCH_ENTRY
import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_FINANCE_TEAM_ENTRY
import isel.casciffo.casciffospringbackend.research.finance.clinical_trial.monetary_flow.ResearchMonetaryFlow
import isel.casciffo.casciffospringbackend.research.finance.team.ResearchTeamMonetaryFlow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class ResearchFinanceController(
    @Autowired val service: ResearchFinanceService
) {

    @PutMapping(RESEARCH_FINANCE)
    suspend fun updateResearchFinance(
        @PathVariable researchId: Int,
        @RequestBody researchFinance: ResearchFinance
    ): ResponseEntity<ResearchFinance> {
        return ResponseEntity.ok(service.updateFinanceComponent(researchId, researchFinance))
    }

    @PutMapping(RESEARCH_FINANCE_TEAM_ENTRY)
    suspend fun addNewTeamEntry(
        @PathVariable researchId: Int,
        @RequestBody teamEntry: ResearchTeamMonetaryFlow
    ): ResponseEntity<ResearchFinance> {
        return ResponseEntity.ok(service.saveMonetaryTeamFlowEntry(researchId, teamEntry))
    }

    @PutMapping(RESEARCH_FINANCE_RESEARCH_ENTRY)
    suspend fun addNewResearchEntry(
        @PathVariable researchId: Int,
        @RequestBody researchEntry: ResearchMonetaryFlow
    ): ResponseEntity<ResearchFinance> {
        return ResponseEntity.ok(service.saveMonetaryResearchFlowEntry(researchId, researchEntry))
    }
}
