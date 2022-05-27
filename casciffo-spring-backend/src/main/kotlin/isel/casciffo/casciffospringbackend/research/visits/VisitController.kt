package isel.casciffo.casciffospringbackend.research.visits

import isel.casciffo.casciffospringbackend.util.RESEARCH_VISIT_PATIENTS
import isel.casciffo.casciffospringbackend.util.RESEARCH_VISIT_URL
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
class VisitController(
    @Autowired val visitService: VisitService
) {

    @GetMapping(RESEARCH_VISIT_URL)
    suspend fun getVisitsByResearchId(@RequestParam researchId: Int) : Flow<Visit> {
        return visitService.getVisitsForResearch(researchId)
    }

    @PostMapping(RESEARCH_VISIT_URL)
    suspend fun scheduleVisit(@RequestParam researchId: Int, @RequestBody visit: Visit) : Visit {
        visit.researchId = researchId
        try {
            return visitService.createVisit(visit)
        } catch (e: IllegalArgumentException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message, e)
        }
    }

    @GetMapping(RESEARCH_VISIT_PATIENTS)
    suspend fun getVisitsForPatient(@RequestParam researchId: Int, @RequestParam patientId: Int) : Flow<Visit> {
        return visitService.getVisitsForPatient(patientId, patientId)
    }

}