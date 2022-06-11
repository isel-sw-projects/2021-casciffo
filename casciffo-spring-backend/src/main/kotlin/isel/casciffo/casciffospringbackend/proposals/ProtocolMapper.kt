package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProposalProtocol
import kotlinx.coroutines.reactor.awaitSingleOrNull
import reactor.kotlin.core.publisher.toFlux

class ProtocolMapper {
    fun mapProtocolDTOToModel(
        dto: ProtocolDTO
    ): ProposalProtocol {
        return  ProposalProtocol(
            id = dto.id,
            financialComponentId = dto.financialComponentId,
            comments = dto.comments?.toFlux(),
            isValidated = dto.isValidated,
            validatedDate = dto.validatedDate
        )
    }

    suspend fun mapProtocolModelToDTO(
        model: ProposalProtocol
    ): ProtocolDTO {
        return ProtocolDTO(
            id = model.id,
            financialComponentId = model.financialComponentId,
            comments = model.comments?.collectList()?.awaitSingleOrNull(),
            isValidated = model.isValidated,
            validatedDate = model.validatedDate
        )
    }
}