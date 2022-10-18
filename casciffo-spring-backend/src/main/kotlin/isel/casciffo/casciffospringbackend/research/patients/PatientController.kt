package isel.casciffo.casciffospringbackend.research.patients


import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_PATIENT_DETAILS
import isel.casciffo.casciffospringbackend.endpoints.SEARCH_PATIENTS
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class PatientController(
    @Autowired val service: ParticipantService
) {

    @GetMapping(RESEARCH_PATIENT_DETAILS)
    suspend fun getPatientDetails(
        @PathVariable researchId: Int,
        @PathVariable patientProcessNum: Long
    ): ResponseEntity<PatientModel> {
        return ResponseEntity.ok(service.getPatientDetails(researchId, patientProcessNum))
    }

    @GetMapping(SEARCH_PATIENTS)
    suspend fun searchPatientByProcessId(@RequestParam q: Long)
    : ResponseEntity<Flow<PatientModel>> = ResponseEntity.ok(service.searchByProcessIdLike(q))
}