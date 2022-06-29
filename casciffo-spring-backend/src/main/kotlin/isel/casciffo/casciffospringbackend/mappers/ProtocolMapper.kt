package isel.casciffo.casciffospringbackend.mappers

import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProposalProtocol
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolDTO
import org.springframework.stereotype.Component

@Component
class ProtocolMapper : Mapper<ProposalProtocol, ProtocolDTO> {
    override suspend fun mapDTOtoModel(dto: ProtocolDTO?): ProposalProtocol {
        throw NotImplementedError("Left blank on purpose.")
    }

    override suspend fun mapModelToDTO(model: ProposalProtocol?): ProtocolDTO {
        return if (model === null) ProtocolDTO()
        else ProtocolDTO(
            id = model.id,
            financialComponentId = model.financialComponentId,
            validated = model.validated,
            validatedDate = model.validatedDate
        )
    }
}