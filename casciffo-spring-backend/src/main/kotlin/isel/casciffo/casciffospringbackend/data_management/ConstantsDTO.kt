package isel.casciffo.casciffospringbackend.data_management


data class ConstantsDTO(
    var pathologies: List<Pathology>? = null,
    var serviceTypes: List<ServiceType>? = null,
    var therapeuticAreas: List<TherapeuticArea>? = null,
)
