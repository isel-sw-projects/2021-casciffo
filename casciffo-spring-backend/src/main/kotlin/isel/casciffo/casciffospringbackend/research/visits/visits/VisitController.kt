package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.endpoints.*
import isel.casciffo.casciffospringbackend.mappers.Mapper
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
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
    ): ResponseEntity<ResearchPatientWithVisitsDTO> {

        val aggregate = visitService.addPatientWithVisits(researchId, patientWithVisitsDTO)
        val dto = ResearchPatientWithVisitsDTO(
            researchPatient = aggregate.researchPatient,
            scheduledVisits = if(aggregate.visits != null) aggregate.visits.map(mapper::mapModelToDTO).toList() else null
        )
        println()
        return ResponseEntity.status(HttpStatus.CREATED).body(dto)
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

    @GetMapping(RESEARCH_VISIT_PATIENTS_URL)
    suspend fun getVisitsForResearchPatient(@PathVariable researchId: Int, @PathVariable patientId: Int) : Flow<VisitDTO> {
        return visitService.getVisitsForResearchPatient(patientId, patientId).map { mapper.mapModelToDTO(it) }
    }

    @GetMapping(PATIENTS_DETAIL_VISITS_URL)
    suspend fun getAllVisitsForPatient(@PathVariable patientId: Int) : Flow<VisitDTO> {
        return visitService.getVisitsForResearchPatient(patientId, patientId).map { mapper.mapModelToDTO(it) }
    }

    @GetMapping(RESEARCH_VISIT_DETAIL_URL)
    suspend fun getVisitDetails(@PathVariable researchId: Int, @PathVariable visitId: Int) : VisitDTO {
        val visit = visitService.getVisitDetails(researchId, visitId)
        return mapper.mapModelToDTO(visit)
    }

}