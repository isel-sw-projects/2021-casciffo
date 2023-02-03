package isel.casciffo.casciffospringbackend.research.patients


import isel.casciffo.casciffospringbackend.endpoints.PATIENTS_DETAIL_URL
import isel.casciffo.casciffospringbackend.endpoints.PATIENTS_URL
import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_PATIENT_DETAILS_URL
import isel.casciffo.casciffospringbackend.endpoints.SEARCH_PATIENTS_URL
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class PatientController(
    @Autowired val service: ParticipantService
) {

    @GetMapping(RESEARCH_PATIENT_DETAILS_URL)
    suspend fun getPatientDetails(
        @PathVariable researchId: Int,
        @PathVariable patientProcessNum: Long
    ): ResponseEntity<ResearchPatient> {
        val patient = service.getPatientDetails(researchId, patientProcessNum)
        return ResponseEntity.ok(patient)
    }

    @GetMapping(SEARCH_PATIENTS_URL)
    suspend fun searchPatientByProcessId(@RequestParam q: Long)
    : ResponseEntity<Flow<PatientModel>> = ResponseEntity.ok(service.searchByProcessIdLike(q))

    @GetMapping(PATIENTS_URL)
    suspend fun fetchPatients(): Flow<PatientModel> = service.findAll()

    @PostMapping(PATIENTS_URL)
    suspend fun createPatient(@RequestBody patientModel: PatientModel): ResponseEntity<PatientModel> {
        val createdPatient = service.save(patientModel)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPatient)
    }

    @DeleteMapping(PATIENTS_DETAIL_URL)
    suspend fun deletePatient(@PathVariable patientId: Int): ResponseEntity<PatientModel?> {
        val deleted = service.deletePatient(patientId)
        return if(deleted != null)
            ResponseEntity.ok(deleted)
        else
            ResponseEntity.noContent().build()
    }
}