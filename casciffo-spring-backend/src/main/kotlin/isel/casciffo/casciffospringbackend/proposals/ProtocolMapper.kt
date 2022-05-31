package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProposalProtocol
import kotlinx.coroutines.reactor.awaitSingle
import reactor.kotlin.core.publisher.toFlux

class ProtocolMapper {
    fun mapProtocolDTOToModel(
        dto: ProtocolDTO
    ): ProposalProtocol {
        return  ProposalProtocol(
            id = dto.id,
            financialComponentId = dto.financialComponentId,
            comments = dto.comments?.toFlux(),
            externalName = dto.externalName,
            externalDateValidated = dto.externalDateValidated,
            externalValidated = dto.externalValidated,
            internalName = dto.internalName,
            internalDateValidated = dto.internalDateValidated,
            internalValidated = dto.internalValidated
        )
    }

    suspend fun mapProtocolModelToDTO(
        model: ProposalProtocol
    ): ProtocolDTO {
        return ProtocolDTO(
                id = model.id,
                financialComponentId = model.financialComponentId,
                comments = model.comments?.collectList()?.awaitSingle(),
                externalName = model.externalName,
                externalDateValidated = model.externalDateValidated,
                externalValidated = model.externalValidated,
                internalName = model.internalName,
                internalDateValidated = model.internalDateValidated,
                internalValidated = model.internalValidated
            )
    }
}