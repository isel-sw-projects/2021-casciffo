package isel.casciffo.casciffospringbackend.mappers

interface Mapper<Model, DTO> {
    suspend fun mapDTOtoModel(dto: DTO?): Model

    suspend fun mapModelToDTO(model: Model?): DTO
}