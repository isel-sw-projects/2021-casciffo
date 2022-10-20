package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregate
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.endpoints.*
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaComment
import isel.casciffo.casciffospringbackend.research.patients.ResearchPatient
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivity
import isel.casciffo.casciffospringbackend.research.visits.visits.PatientWithVisitsDTO
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitModel
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

    @PostMapping(RESEARCH_CANCEL_URL)
    suspend fun cancelResearch(@PathVariable researchId: Int,@RequestBody cancelDTO: CancelDTO): ResponseEntity<ResearchAnswerDTO> {
        val result = researchService.cancelResearch(researchId, cancelDTO.reason, cancelDTO.userId)
        return endResearch(result, researchId)
    }

    @PostMapping(RESEARCH_COMPLETE_URL)
    suspend fun completeResearch(@PathVariable researchId: Int): ResponseEntity<ResearchAnswerDTO> {
        val result = researchService.completeResearch(researchId)
        return endResearch(result, researchId)
    }

    suspend fun endResearch(result: Boolean, researchId: Int): ResponseEntity<ResearchAnswerDTO> {
        val research = researchService.getResearch(researchId)
        return ResponseEntity.ok(ResearchAnswerDTO(result, mapper.mapModelToDTO(research)))
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
        @RequestBody patientWithVisitsDTO: PatientWithVisitsDTO
    ): ResponseEntity<Flow<VisitModel>> {
        val result = researchService.addPatientWithVisits(researchId, patientWithVisitsDTO)
        return ResponseEntity.status(HttpStatus.CREATED).body(result)
    }

    @PutMapping(RESEARCH_PATIENTS_RANDOMIZE)
    suspend fun randomizeTreatmentBranches(
        @PathVariable researchId: Int,
        @RequestBody patients: List<ResearchPatient>
    ): ResponseEntity<Flow<ResearchPatient>> {
        val res = researchService.randomizeTreatmentBranches(researchId, patients)
        return ResponseEntity.ok(res)
    }

    @PostMapping(RESEARCH_PATIENTS)
    suspend fun addParticipant(
        @PathVariable researchId: Int,
        @RequestParam participantId: Int
    ) {
        researchService.addParticipant(researchId, participantId)
    }

    @PostMapping(ADDENDA_URL)
    suspend fun createAddenda(@PathVariable researchId: Int, @RequestBody addenda: Addenda) : Addenda {
        addenda.researchId = researchId
        return researchService.createAddenda(addenda)
    }

    @PostMapping(ADDENDA_DETAIL_COMMENTS_URL)
    suspend fun createAddendaComment(@PathVariable researchId: Int, @PathVariable addendaId: Int, @RequestBody addendaComment: AddendaComment) : ResponseEntity<AddendaComment> {
        val comment = researchService.createAddendaComment(addendaId, addendaComment)
        return ResponseEntity.status(HttpStatus.CREATED).body(comment)
    }

    @GetMapping(ADDENDA_DETAIL_URL)
    suspend fun getAddendaDetails(@PathVariable researchId: Int, @PathVariable addendaId: Int) : Addenda {
        return researchService.getAddenda(researchId, addendaId)
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

data class CancelDTO (val reason: String, val userId: Int)