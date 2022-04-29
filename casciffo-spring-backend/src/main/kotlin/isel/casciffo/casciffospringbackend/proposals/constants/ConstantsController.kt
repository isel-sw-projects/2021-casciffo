package isel.casciffo.casciffospringbackend.proposals.constants

import isel.casciffo.casciffospringbackend.util.CONSTANTS_BASE_URL
import isel.casciffo.casciffospringbackend.util.PATHOLOGY_URL
import isel.casciffo.casciffospringbackend.util.SERVICE_TYPE_URL
import isel.casciffo.casciffospringbackend.util.THERAPEUTIC_AREA_URL
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
class ConstantsController(
    @Autowired val pathologyRepository: PathologyRepository,
    @Autowired val serviceTypeRepository: ServiceTypeRepository,
    @Autowired val therapeuticAreaRepository: TherapeuticAreaRepository
) {
    @PostMapping(PATHOLOGY_URL)
    suspend fun createPathology(@RequestBody pathology: Pathology): Pathology =
        pathologyRepository.save(pathology).awaitSingle()

    @PostMapping(SERVICE_TYPE_URL)
    suspend fun createServiceType(@RequestBody serviceType: ServiceType): ServiceType =
        serviceTypeRepository.save(serviceType).awaitSingle()

    @PostMapping(THERAPEUTIC_AREA_URL)
    suspend fun createTherapeuticArea(@RequestBody therapeuticArea: TherapeuticArea): TherapeuticArea =
        therapeuticAreaRepository.save(therapeuticArea).awaitSingle()

    @GetMapping(PATHOLOGY_URL)
    suspend fun getPathology(@RequestBody pathology: Pathology): Flow<Pathology> =
        pathologyRepository.findAll().asFlow()

    @GetMapping(SERVICE_TYPE_URL)
    suspend fun getServiceType(@RequestBody serviceType: ServiceType): Flow<ServiceType> =
        serviceTypeRepository.findAll().asFlow()

    @GetMapping(THERAPEUTIC_AREA_URL)
    suspend fun getTherapeuticArea(@RequestBody therapeuticArea: TherapeuticArea): Flow<TherapeuticArea> =
        therapeuticAreaRepository.findAll().asFlow()
}