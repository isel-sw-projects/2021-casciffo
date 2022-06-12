package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import io.netty.handler.ssl.ApplicationProtocolConfig.Protocol
import isel.casciffo.casciffospringbackend.Mapper
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Component
import reactor.kotlin.core.publisher.toFlux

@Component
class ProtocolMapper: Mapper<ProposalProtocol, ProtocolDTO> {
    override suspend fun mapDTOtoModel(dto: ProtocolDTO?): ProposalProtocol {
        return if (dto === null) ProposalProtocol()
        else ProposalProtocol(
            id = dto.id,
            financialComponentId = dto.financialComponentId,
            comments = dto.comments?.toFlux(),
            isValidated = dto.isValidated,
            validatedDate = dto.validatedDate
        )
    }

    override suspend fun mapModelToDTO(model: ProposalProtocol?): ProtocolDTO {
        return if (model === null) ProtocolDTO()
        else ProtocolDTO(
            id = model.id,
            financialComponentId = model.financialComponentId,
            comments = model.comments?.collectList()?.awaitSingleOrNull(),
            isValidated = model.isValidated,
            validatedDate = model.validatedDate
        )
    }
}