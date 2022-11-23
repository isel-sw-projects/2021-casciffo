package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_VISIT_DETAIL_URL
import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_VISIT_PATIENTS
import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_VISIT_URL
import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_VISIT_WITH_PATIENT_URL
import isel.casciffo.casciffospringbackend.mappers.Mapper
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class VisitController(
    @Autowired val visitService: VisitService,
    @Autowired val mapper: Mapper<VisitModel, VisitDTO>
) {

    @GetMapping(RESEARCH_VISIT_URL)
    suspend fun getVisitsByResearchId(@PathVariable researchId: Int) : Flow<VisitDTO> {
        return visitService.getVisitsForResearch(researchId).map(mapper::mapModelToDTO)
    }

    @PostMapping(RESEARCH_VISIT_URL)
    suspend fun scheduleVisit(@PathVariable researchId: Int, @RequestBody visit: VisitDTO): Flow<VisitDTO> {
        return visitService.scheduleVisits(researchId, listOf(visit))
            .map(mapper::mapModelToDTO)
    }

    @PostMapping(RESEARCH_VISIT_WITH_PATIENT_URL)
    suspend fun addPatientAndScheduleVisits(
        @PathVariable researchId: Int,
        @RequestBody patientWithVisitsDTO: PatientWithVisitsDTO
    ): ResponseEntity<Flow<VisitDTO>> {

        val result = visitService.addPatientWithVisits(researchId, patientWithVisitsDTO)
        return ResponseEntity.status(HttpStatus.CREATED).body(result.map(mapper::mapModelToDTO))
    }

    @PostMapping(RESEARCH_VISIT_DETAIL_URL)
    suspend fun concludeVisit(
        @PathVariable researchId: Int,
        @PathVariable visitId: Int,
        @RequestBody visitDTO: VisitDTO
    ): VisitDTO {
        val model = mapper.mapDTOtoModel(visitDTO)
        val result = visitService.concludeVisit(model)
        return mapper.mapModelToDTO(result)
    }

    @GetMapping(RESEARCH_VISIT_PATIENTS)
    suspend fun getVisitsForPatient(@PathVariable researchId: Int, @PathVariable patientId: Int) : Flow<VisitDTO> {
        return visitService.getVisitsForPatient(patientId, patientId).map { mapper.mapModelToDTO(it) }
    }

    @GetMapping(RESEARCH_VISIT_DETAIL_URL)
    suspend fun getVisitDetails(@PathVariable researchId: Int, @PathVariable visitId: Int) : VisitDTO {
        val visit = visitService.getVisitDetails(researchId, visitId)
        return mapper.mapModelToDTO(visit)
    }

}