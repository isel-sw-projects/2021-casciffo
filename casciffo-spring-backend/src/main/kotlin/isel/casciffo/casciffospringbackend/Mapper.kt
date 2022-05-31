package isel.casciffo.casciffospringbackend

interface Mapper<Model, DTO> {
    suspend fun mapDTONonListPropertiesToModel(dto: DTO, model: Model)

    suspend fun mapDTOListPropertiesToModel(dto: DTO, model: Model)

    suspend fun mapModelNonListPropertiesToDTO(model: Model, dto: DTO)

    suspend fun mapModelListPropertiesToDTO(model: Model, dto: DTO)

    suspend fun mapDTOtoModel(dto: DTO): Model

    suspend fun mapModelToDTO(model: Model): DTO
}