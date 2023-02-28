package isel.casciffo.casciffospringbackend.mappers.addenda

import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.addenda.AddendaDTO
import kotlinx.coroutines.flow.asFlow
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Component
import reactor.kotlin.core.publisher.toFlux

@Component
class AddendaMapper: Mapper<Addenda, AddendaDTO> {
    override suspend fun mapDTOtoModel(dto: AddendaDTO?): Addenda {
        return if(dto === null) Addenda()
        else Addenda(
            id = dto.id,
            researchId = dto.researchId,
            stateId = dto.stateId,
            fileId = dto.fileId,
            createdDate = dto.createdDate,
            state = dto.state,
            stateTransitions = dto.stateTransitions?.asFlow(),
            fileInfo = dto.fileInfo,
            observations = dto.observations?.asFlow()
        )
    }

    override suspend fun mapModelToDTO(model: Addenda?): AddendaDTO {
        return if(model === null) AddendaDTO()
        else AddendaDTO(
            id = model.id,
            researchId = model.researchId,
            stateId = model.stateId,
            fileId = model.fileId,
            createdDate = model.createdDate,
            state = model.state,
            stateTransitions = model.stateTransitions?.toList(),
            fileInfo = model.fileInfo,
            observations = model.observations?.toList()
        )
    }
}