package isel.casciffo.casciffospringbackend.proposals.constants

import kotlinx.coroutines.flow.Flow


data class ConstantsDTO(
    var pathologies: List<Pathology>? = null,
    var serviceTypes: List<ServiceType>? = null,
    var therapeuticAreas: List<TherapeuticArea>? = null,
)
