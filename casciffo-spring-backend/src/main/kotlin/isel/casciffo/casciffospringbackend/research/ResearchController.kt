package isel.casciffo.casciffospringbackend.research

import isel.casciffo.casciffospringbackend.proposals.ResearchType
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.patients.Participant
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivities
import isel.casciffo.casciffospringbackend.util.*
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
class ResearchController(
    @Autowired val researchService: ResearchService
) {

    @GetMapping(RESEARCH_BASE_URL)
    suspend fun getAllResearch(type: ResearchType) : Flow<Research> {
        return researchService.getAllResearchesByType(type)
    }

    @GetMapping(RESEARCH_URI)
    suspend fun getResearch(@PathVariable researchId: Int) : Research {
        return researchService.getResearch(researchId)
    }

    @PatchMapping(RESEARCH_URI)
    suspend fun updateResearch(@RequestBody research: Research) : Research {
        return researchService.updateResearch(research)
    }

    @PostMapping(RESEARCH_URI)
    suspend fun createResearch(@RequestBody research: Research) : Research {
        return researchService.createResearch(research)
    }

    @PostMapping(RESEARCH_PARTICIPANTS)
    suspend fun addParticipant(
        @RequestParam(required = true) researchId: Int,
        @RequestParam(required = true) participantId: Int
    ) {
        researchService.addParticipant(researchId, participantId)
    }

    @PostMapping(POST_ADDENDA_URI)
    suspend fun createAddenda(@PathVariable researchId: Int, @RequestBody addenda: Addenda) : Addenda {
        addenda.researchId = researchId
        return researchService.createAddenda(addenda)
    }

    @PostMapping(RESEARCH_STUDIES_URI)
    suspend fun createStudy(
        @PathVariable researchId: Int,
        @RequestBody study: ScientificActivities
    ) : ScientificActivities {
        study.researchId = researchId
        return researchService.createStudy(study)
    }

    @GetMapping(RESEARCH_STUDIES_URI)
    suspend fun getStudies(@PathVariable researchId: Int) : Flow<ScientificActivities> {
        return researchService.getResearchStudies(researchId)
    }
}