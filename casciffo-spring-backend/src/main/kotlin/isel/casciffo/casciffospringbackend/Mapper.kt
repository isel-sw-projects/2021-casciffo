package isel.casciffo.casciffospringbackend

interface Mapper<Model, DTO> {
    suspend fun mapDTOtoModel(dto: DTO?): Model

    suspend fun mapModelToDTO(model: Model?): DTO
}