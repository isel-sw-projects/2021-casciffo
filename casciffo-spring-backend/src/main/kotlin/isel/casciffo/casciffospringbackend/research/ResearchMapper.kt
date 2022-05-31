package isel.casciffo.casciffospringbackend.research

import isel.casciffo.casciffospringbackend.proposals.ProposalDTO
import isel.casciffo.casciffospringbackend.proposals.ProposalModel
import kotlinx.coroutines.reactor.awaitSingle
import reactor.kotlin.core.publisher.toFlux

class ResearchMapper {
    private fun mapDTONonListPropertiesToModel(dto: ResearchDTO, model: ResearchModel) {
        model.id = dto.id
        model.cro = dto.cro
        model.duration = dto.duration
        model.industry = dto.industry
        model.type = dto.type
        model.startDate = dto.startDate
        model.endDate = dto.endDate
        model.estimatedEndDate = dto.estimatedEndDate
        model.initiativeBy = dto.initiativeBy
        model.eudra_ct = dto.eudra_ct
        model.phase = dto.phase
        model.proposal = dto.proposal
        model.proposalId = dto.proposalId
        model.protocol = dto.protocol
        model.sampleSize = dto.sampleSize
    }

    private fun mapDTOListPropertiesToModel(dto: ResearchDTO, model: ResearchModel)  {
        model.participants = dto.participants?.toFlux()
        model.stateTransitions = dto.stateTransitions?.toFlux()
    }

    private fun mapModelNonListPropertiesToDTO(model: ResearchModel, dto: ResearchDTO) {
        dto.id = model.id
        dto.cro = model.cro
        dto.duration = model.duration
        dto.industry = model.industry
        dto.type = model.type
        dto.startDate = model.startDate
        dto.endDate = model.endDate
        dto.estimatedEndDate = model.estimatedEndDate
        dto.initiativeBy = model.initiativeBy
        dto.eudra_ct = model.eudra_ct
        dto.phase = model.phase
        dto.proposal = model.proposal
        dto.proposalId = model.proposalId
        dto.protocol = model.protocol
        dto.sampleSize = model.sampleSize
    }

    private suspend fun mapModelListPropertiesToDTO(model: ResearchModel, dto: ResearchDTO) {
        dto.participants = model.participants?.collectList()?.awaitSingle()
        dto.stateTransitions = model.stateTransitions?.collectList()?.awaitSingle()
    }

    fun mapDTOtoModel(dto: ResearchDTO): ResearchModel {
        val model = ResearchModel()
        mapDTONonListPropertiesToModel(dto = dto, model = model)
        mapDTOListPropertiesToModel(dto = dto, model = model)
        return model
    }

    suspend fun mapModelToDTO(model: ResearchModel): ResearchDTO {
        val dto = ResearchDTO()
        mapModelNonListPropertiesToDTO(model, dto)
        mapModelListPropertiesToDTO(model, dto)
        return dto
    }
}