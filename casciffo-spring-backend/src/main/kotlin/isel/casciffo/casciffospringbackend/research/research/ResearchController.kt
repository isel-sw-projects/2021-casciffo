package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregate
import isel.casciffo.casciffospringbackend.common.CountHolder
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.endpoints.*
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaComment
import isel.casciffo.casciffospringbackend.research.patients.ResearchPatient
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivity
import isel.casciffo.casciffospringbackend.statistics.ResearchStats
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class ResearchController(
    @Autowired val researchService: ResearchService,
    @Autowired val mapper: Mapper<ResearchModel, ResearchDTO>
) {

    /** **************************************************************************************************/
    /** *************************************** GET METHODS **********************************************/
    /** **************************************************************************************************/
    @GetMapping(RESEARCH_COUNT_URL)
    suspend fun getResearchCount(): ResponseEntity<CountHolder> {
        val counters = researchService.getResearchCount()
        return ResponseEntity.ok(counters)
    }

    @GetMapping(RESEARCH_LATEST_MODIFIED_URL)
    suspend fun getLatestModifiedResearch(@RequestParam(required = false, defaultValue = "5") n: Int): Flow<ResearchAggregate> {
        return researchService.getLatestModifiedResearch(n)
    }

    /**
     * Fetches all research.
     * @param type The research type.
     * @param p The page to fetch. Default is 1.
     * @param n The number of elements to fetch. Default is 20.
     * @param s The sorting attributed. Uses createdDate by default
     * @param so The sort order; true for ASC, false for DESC, false by default.
     * @param ga Get All attribute, when true, all research of [type] will be returned with no pagination.
     * @return Returns all proposals of type [type]. Limited by [n]
     */
    @GetMapping(RESEARCH_URL)
    suspend fun getAllResearch(
        @RequestParam type: ResearchType,
        @RequestParam(required = false, defaultValue = "1") p: Int,
        @RequestParam(required = false, defaultValue = "20") n: Int,
        @RequestParam(required = false, defaultValue = "created_date") s: String,
        @RequestParam(required = false, defaultValue = "false") so: Boolean,
        @RequestParam(required = false, defaultValue = "false") ga: Boolean
    ) : Flow<ResearchAggregate> {
        if(ga) return researchService.getAllResearchesByType(type)
        val page = PageRequest.of(p, n, if(so) Sort.by(s).descending() else Sort.by(s).ascending())
        return researchService.getAllResearchesByType(type, page)
    }

    @GetMapping(RESEARCH_DETAIL_URL)
    suspend fun getResearch(@PathVariable researchId: Int) : ResearchDTO {
        return mapper.mapModelToDTO(researchService.getResearch(researchId))
    }

    @GetMapping(ADDENDA_DETAIL_URL)
    suspend fun getAddendaDetails(@PathVariable researchId: Int, @PathVariable addendaId: Int) : Addenda {
        return researchService.getAddenda(researchId, addendaId)
    }

    @GetMapping(RESEARCH_GENERAL_STATS_URL)
    suspend fun getResearchStats(): ResponseEntity<Flow<ResearchStats>> {
        val stats = researchService.getResearchStats()
        return ResponseEntity.ok(stats)
    }
    /** **************************************************************************************************/
    /** *************************************** POST METHODS *********************************************/
    /** **************************************************************************************************/
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


    @PostMapping(RESEARCH_URL)
    suspend fun createResearch(@RequestBody researchDTO: ResearchDTO) : ResearchDTO {
        val mappedModel = mapper.mapDTOtoModel(researchDTO)
        val model = researchService.createResearch(mappedModel)
        return mapper.mapModelToDTO(model)
    }

    @PostMapping(RESEARCH_PATIENTS_URL)
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

    @PostMapping(RESEARCH_STUDIES_URL)
    suspend fun createStudy(
        @PathVariable researchId: Int,
        @RequestBody study: ScientificActivity
    ) : ScientificActivity {
        study.researchId = researchId
        return researchService.createStudy(study)
    }


    /** **************************************************************************************************/
    /** *************************************** PUT METHODS **********************************************/
    /** **************************************************************************************************/
    @PutMapping(RESEARCH_DETAIL_URL)
    suspend fun updateResearch(@RequestBody researchDTO: ResearchDTO, @PathVariable researchId: Int) : ResearchDTO {
        val mappedModel = mapper.mapDTOtoModel(researchDTO)
        val model = researchService.updateResearch(mappedModel)
        return mapper.mapModelToDTO(model)
    }

    @PutMapping(RESEARCH_PATIENTS_RANDOMIZE_URL)
    suspend fun randomizeTreatmentBranches(
        @PathVariable researchId: Int,
        @RequestBody patients: List<ResearchPatient>
    ): ResponseEntity<Flow<ResearchPatient>> {
        val res = researchService.randomizeTreatmentBranches(researchId, patients)
        return ResponseEntity.ok(res)
    }

    /** **************************************************************************************************/
    /** ************************************** DELETE METHODS ********************************************/
    /** **************************************************************************************************/

    @DeleteMapping(RESEARCH_PATIENT_DETAILS_URL)
    suspend fun removeParticipant(
        @PathVariable researchId: Int,
        @PathVariable patientProcessNum: Int
    ): ResponseEntity<Unit> {
        researchService.removeParticipant(researchId, patientProcessNum)
        return ResponseEntity.noContent().build()
    }

    /** **************************************************************************************************/
    /** ************************************ AUXILIARY METHODS *******************************************/
    /** **************************************************************************************************/

    suspend fun endResearch(result: Boolean, researchId: Int): ResponseEntity<ResearchAnswerDTO> {
        val research = researchService.getResearch(researchId)
        return ResponseEntity.ok(ResearchAnswerDTO(result, mapper.mapModelToDTO(research)))
    }
}

data class CancelDTO (val reason: String, val userId: Int)
