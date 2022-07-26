package isel.casciffo.casciffospringbackend.mappers.protocol

import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProposalProtocol
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolDTO
import org.springframework.stereotype.Component

@Component
class ProtocolMapper : Mapper<ProposalProtocol, ProtocolDTO> {
    override suspend fun mapDTOtoModel(dto: ProtocolDTO?): ProposalProtocol {
//        throw NotImplementedError("Left blank on purpose.")
        return if(dto === null) ProposalProtocol()
        else ProposalProtocol(
            id = dto.id,
            financialComponentId = dto.financialComponentId,
            validated = dto.validated,
            validatedDate = dto.validatedDate,
            commentRef = dto.commentRef
        )
    }

    override suspend fun mapModelToDTO(model: ProposalProtocol?): ProtocolDTO {
        return if (model === null) ProtocolDTO()
        else ProtocolDTO(
            id = model.id,
            financialComponentId = model.financialComponentId,
            validated = model.validated,
            validatedDate = model.validatedDate,
            commentRef = model.commentRef
        )
    }
}