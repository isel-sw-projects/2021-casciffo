package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregate
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.endpoints.*
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivity
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitDTO
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class ResearchController(
    @Autowired val researchService: ResearchService,
    @Autowired val mapper: Mapper<ResearchModel, ResearchDTO>
) {

    @GetMapping(RESEARCH_URL)
    suspend fun getAllResearch(@RequestParam type: ResearchType) : Flow<ResearchAggregate> {
        return researchService.getAllResearchesByType(type)
    }

    @GetMapping(RESEARCH_DETAIL_URL)
    suspend fun getResearch(@PathVariable researchId: Int) : ResearchDTO {
        return mapper.mapModelToDTO(researchService.getResearch(researchId))
    }

    @PutMapping(RESEARCH_DETAIL_URL)
    suspend fun updateResearch(@RequestBody researchDTO: ResearchDTO, @PathVariable researchId: Int) : ResearchDTO {
        val mappedModel = mapper.mapDTOtoModel(researchDTO)
        val model = researchService.updateResearch(mappedModel)
        return mapper.mapModelToDTO(model)
    }



    @PostMapping(RESEARCH_URL)
    suspend fun createResearch(@RequestBody researchDTO: ResearchDTO) : ResearchDTO {
        val mappedModel = mapper.mapDTOtoModel(researchDTO)
        val model = researchService.createResearch(mappedModel)
        return mapper.mapModelToDTO(model)
    }


    @PostMapping(RESEARCH_VISIT_URL)
    suspend fun addPatientAndScheduleVisits(
        @PathVariable researchId: Int,
        @RequestBody visitDTO: VisitDTO
    ): ResponseEntity<VisitDTO> {
        val result = researchService.addPatientWithVisits(researchId, visitDTO)
        return ResponseEntity.status(HttpStatus.CREATED).body(result)
    }

    @PostMapping(RESEARCH_PATIENTS)
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
        @RequestBody study: ScientificActivity
    ) : ScientificActivity {
        study.researchId = researchId
        return researchService.createStudy(study)
    }
}