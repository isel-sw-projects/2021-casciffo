package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_VISIT_DETAIL_URL
import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_VISIT_PATIENTS
import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_VISIT_URL
import isel.casciffo.casciffospringbackend.mappers.Mapper
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
class VisitController(
    @Autowired val visitService: VisitService,
    @Autowired val mapper: Mapper<VisitModel, VisitDTO>
) {

    @GetMapping(RESEARCH_VISIT_URL)
    suspend fun getVisitsByResearchId(@RequestParam researchId: Int) : Flow<VisitModel> {
        return visitService.getVisitsForResearch(researchId)
    }

//    @PostMapping(RESEARCH_VISIT_URL)
//    suspend fun scheduleVisits(@RequestParam researchId: Int, @RequestBody visit: Visit) : Visit {
//        visit.researchId = researchId
//        try {
//            return visitService.createVisit(visit)
//        } catch (e: IllegalArgumentException) {
//            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message, e)
//        }
//    }


    @GetMapping(RESEARCH_VISIT_PATIENTS)
    suspend fun getVisitsForPatient(@RequestParam researchId: Int, @RequestParam patientId: Int) : Flow<VisitModel> {
        return visitService.getVisitsForPatient(patientId, patientId)
    }

    @GetMapping(RESEARCH_VISIT_DETAIL_URL)
    suspend fun getVisitDetails(@PathVariable researchId: Int, @PathVariable visitId: Int) : VisitDTO {
        val visit = visitService.getVisitDetails(researchId, visitId)
        return mapper.mapModelToDTO(visit)
    }

}