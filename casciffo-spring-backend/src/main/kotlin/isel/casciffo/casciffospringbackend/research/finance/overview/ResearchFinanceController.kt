package isel.casciffo.casciffospringbackend.research.finance.overview

import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_FINANCE_URL
import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_FINANCE_RESEARCH_ENTRY_URL
import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_FINANCE_TEAM_ENTRY_URL
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.finance.research_monetary_flow.ResearchMonetaryFlow
import isel.casciffo.casciffospringbackend.research.finance.team_monetary_flow.ResearchTeamMonetaryFlow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class ResearchFinanceController(
    @Autowired val service: ResearchFinanceService,
    @Autowired val mapper: Mapper<ResearchFinance, ResearchFinanceDTO>
) {

    @PutMapping(RESEARCH_FINANCE_URL)
    suspend fun updateResearchFinance(
        @PathVariable researchId: Int,
        @RequestBody rf: ResearchFinanceDTO
    ): ResponseEntity<ResearchFinanceDTO> {
        val model = mapper.mapDTOtoModel(rf)
        val result = service.updateFinanceComponent(researchId, model)
        val dto = mapper.mapModelToDTO(result)
        return ResponseEntity.ok(dto)
    }

    @PutMapping(RESEARCH_FINANCE_TEAM_ENTRY_URL)
    suspend fun addNewTeamEntry(
        @PathVariable researchId: Int,
        @RequestBody teamEntry: ResearchTeamMonetaryFlow
    ): ResponseEntity<ResearchFinanceWithEntryDTO> {
        val entry = service.saveMonetaryTeamFlowEntry(researchId, teamEntry)
        return ResponseEntity.ok(entry)
    }

    @PutMapping(RESEARCH_FINANCE_RESEARCH_ENTRY_URL)
    suspend fun addNewResearchEntry(
        @PathVariable researchId: Int,
        @RequestBody researchEntry: ResearchMonetaryFlow
    ): ResponseEntity<ResearchFinanceWithEntryDTO> {
        val entry = service.saveMonetaryResearchFlowEntry(researchId, researchEntry)
        return ResponseEntity.ok(entry)
    }
}
