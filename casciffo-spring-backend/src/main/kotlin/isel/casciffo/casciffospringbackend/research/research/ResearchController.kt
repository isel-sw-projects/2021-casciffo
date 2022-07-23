package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.endpoints.*
import isel.casciffo.casciffospringbackend.mappers.ResearchMapper
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivities
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
class ResearchController(
    @Autowired val researchService: ResearchService
) {

    val mapper: ResearchMapper = ResearchMapper()

    @GetMapping(RESEARCHES_URL)
    suspend fun getAllResearch(@RequestParam type: ResearchType) : Flow<ResearchModel> {
        return researchService.getAllResearchesByType(type)
    }

    @GetMapping(RESEARCH_URL)
    suspend fun getResearch(@PathVariable researchId: Int) : ResearchModel {
        return researchService.getResearch(researchId)
    }

    @PatchMapping(RESEARCH_URL)
    suspend fun updateResearch(@RequestBody researchDTO: ResearchDTO, @PathVariable researchId: Int) : ResearchDTO {
        val mappedModel = mapper.mapDTOtoModel(researchDTO)
        val model = researchService.updateResearch(mappedModel)
        return mapper.mapModelToDTO(model)
    }

    @PostMapping(RESEARCHES_URL)
    suspend fun createResearch(@RequestBody researchDTO: ResearchDTO) : ResearchDTO {
        val mappedModel = mapper.mapDTOtoModel(researchDTO)
        val model = researchService.createResearch(mappedModel)
        return mapper.mapModelToDTO(model)
    }

    @PostMapping(RESEARCH_PARTICIPANTS)
    suspend fun addParticipant(
        @PathVariable researchId: Int,
        @RequestParam participantId: Int
    ) {
        researchService.addParticipant(researchId, participantId)
    }

    @PostMapping(POST_ADDENDA_URL)
    suspend fun createAddenda(@PathVariable researchId: Int, @RequestBody addenda: Addenda) : Addenda {
        addenda.researchId = researchId
        return researchService.createAddenda(addenda)
    }

    @PostMapping(RESEARCH_STUDIES_URL)
    suspend fun createStudy(
        @PathVariable researchId: Int,
        @RequestBody study: ScientificActivities
    ) : ScientificActivities {
        study.researchId = researchId
        return researchService.createStudy(study)
    }

    @GetMapping(RESEARCH_STUDIES_URL)
    suspend fun getStudies(@PathVariable researchId: Int) : Flow<ScientificActivities> {
        return researchService.getResearchStudies(researchId)
    }
}