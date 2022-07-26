package isel.casciffo.casciffospringbackend.mappers.research

import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.research.ResearchDTO
import isel.casciffo.casciffospringbackend.research.research.ResearchModel
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.stereotype.Component
import reactor.kotlin.core.publisher.toFlux

@Component
class ResearchMapper: Mapper<ResearchModel, ResearchDTO> {

    override suspend fun mapDTOtoModel(dto: ResearchDTO?): ResearchModel {
        if(dto == null) return ResearchModel()
        return ResearchModel(
            id = dto.id,
            cro = dto.cro,
            duration = dto.duration,
            industry = dto.industry,
            type = dto.type,
            startDate = dto.startDate,
            endDate = dto.endDate,
            estimatedEndDate = dto.estimatedEndDate,
            initiativeBy = dto.initiativeBy,
            eudra_ct = dto.eudra_ct,
            phase = dto.phase,
            proposal = dto.proposal,
            proposalId = dto.proposalId,
            protocol = dto.protocol,
            sampleSize = dto.sampleSize,
            participants = dto.participants?.toFlux(),
            stateTransitions = dto.stateTransitions?.toFlux()
        )
    }

    override suspend fun mapModelToDTO(model: ResearchModel?): ResearchDTO {
        if(model == null) return ResearchDTO()
        return ResearchDTO(
            id = model.id,
            cro = model.cro,
            duration = model.duration,
            industry = model.industry,
            type = model.type,
            startDate = model.startDate,
            endDate = model.endDate,
            estimatedEndDate = model.estimatedEndDate,
            initiativeBy = model.initiativeBy,
            eudra_ct = model.eudra_ct,
            phase = model.phase,
            proposal = model.proposal,
            proposalId = model.proposalId,
            protocol = model.protocol,
            sampleSize = model.sampleSize,
            participants = model.participants?.collectList()?.awaitSingle(),
            stateTransitions = model.stateTransitions?.collectList()?.awaitSingle()
        )
    }
}