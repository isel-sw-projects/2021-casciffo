package isel.casciffo.casciffospringbackend.data_management

import isel.casciffo.casciffospringbackend.endpoints.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

@RestController(value = "Constants")
@RequestMapping(headers = ["Accept=application/json"])
class ConstantsController(
    @Autowired val pathologyRepository: PathologyRepository,
    @Autowired val serviceTypeRepository: ServiceTypeRepository,
    @Autowired val therapeuticAreaRepository: TherapeuticAreaRepository
) {

    @GetMapping(CONSTANTS_URL)
    suspend fun getConstants() : ConstantsDTO {
        val constantsDTO = ConstantsDTO()
        constantsDTO.serviceTypes = serviceTypeRepository.findAll().collectList().awaitSingle()
        constantsDTO.pathologies = pathologyRepository.findAll().collectList().awaitSingle()
        constantsDTO.therapeuticAreas = therapeuticAreaRepository.findAll().collectList().awaitSingle()
        return constantsDTO
    }

    @GetMapping(PATHOLOGY_URL)
    suspend fun getPathologies(): Flow<Pathology> =
        pathologyRepository.findAll().asFlow()

    @GetMapping(SERVICE_TYPE_URL)
    suspend fun getServiceTypes(): Flow<ServiceType> =
        serviceTypeRepository.findAll().asFlow()

    @GetMapping(THERAPEUTIC_AREA_URL)
    suspend fun getTherapeuticAreas(): Flow<TherapeuticArea> =
        therapeuticAreaRepository.findAll().asFlow()

    @PostMapping(PATHOLOGY_URL)
    @Transactional
    suspend fun createPathology(@RequestBody pathology: Pathology): Pathology =
        pathologyRepository.save(pathology).awaitSingle()

    @PostMapping(SERVICE_TYPE_URL)
    @Transactional
    suspend fun createServiceType(@RequestBody serviceType: ServiceType): ServiceType =
        serviceTypeRepository.save(serviceType).awaitSingle()

    @PostMapping(THERAPEUTIC_AREA_URL)
    @Transactional
    suspend fun createTherapeuticArea(@RequestBody therapeuticArea: TherapeuticArea): TherapeuticArea =
        therapeuticAreaRepository.save(therapeuticArea).awaitSingle()

    @PutMapping(PATHOLOGY_URL)
    @Transactional
    suspend fun updatePathology(@RequestBody pathology: Pathology): Pathology =
        pathologyRepository.save(pathology).awaitSingle()

    @PutMapping(SERVICE_TYPE_URL)
    @Transactional
    suspend fun updateServiceType(@RequestBody serviceType: ServiceType): ServiceType =
        serviceTypeRepository.save(serviceType).awaitSingle()

    @PutMapping(THERAPEUTIC_AREA_URL)
    @Transactional
    suspend fun updateTherapeuticArea(@RequestBody therapeuticArea: TherapeuticArea): TherapeuticArea =
        therapeuticAreaRepository.save(therapeuticArea).awaitSingle()

    @DeleteMapping(PATHOLOGY_DETAIL_URL)
    @Transactional
    suspend fun deletePathology(@PathVariable pathologyId: Int): ResponseEntity<Pathology?> {
        val toDelete = pathologyRepository.findById(pathologyId).awaitSingleOrNull()
        return if(toDelete != null) {
            pathologyRepository.delete(toDelete).awaitSingleOrNull()
            ResponseEntity.ok(toDelete)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @DeleteMapping(SERVICE_TYPE_DETAIL_URL)
    @Transactional
    suspend fun deleteServiceType(@PathVariable serviceTypeId: Int): ResponseEntity<ServiceType?> {
        val toDelete = serviceTypeRepository.findById(serviceTypeId).awaitSingleOrNull()
        return if(toDelete != null) {
            serviceTypeRepository.delete(toDelete).awaitSingleOrNull()
            ResponseEntity.ok(toDelete)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @DeleteMapping(THERAPEUTIC_AREA_DETAIL_URL)
    @Transactional
    suspend fun deleteTherapeuticArea(@PathVariable therapeuticAreaId: Int): ResponseEntity<TherapeuticArea?> {
        val toDelete = therapeuticAreaRepository.findById(therapeuticAreaId).awaitSingleOrNull()
        return if(toDelete != null) {
            therapeuticAreaRepository.delete(toDelete).awaitSingleOrNull()
            ResponseEntity.ok(toDelete)
        } else {
            ResponseEntity.noContent().build()
        }
    }
}