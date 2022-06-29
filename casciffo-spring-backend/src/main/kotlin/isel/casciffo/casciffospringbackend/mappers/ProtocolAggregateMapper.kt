package isel.casciffo.casciffospringbackend.mappers

import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComment
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsDTO
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProposalProtocol
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolAggregate
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolDTO
import org.springframework.stereotype.Component

@Component
class ProtocolAggregateMapper : Mapper<ProtocolAggregate, ProtocolDTO> {
    override suspend fun mapDTOtoModel(dto: ProtocolDTO?): ProtocolAggregate {
        return if (dto === null) ProtocolAggregate()
        else ProtocolAggregate(
            newValidation = dto.newValidation,
            proposalProtocol = ProposalProtocol(
                id = dto.id,
                financialComponentId = dto.financialComponentId,
                validated = dto.validated,
                validatedDate = dto.validatedDate,
            ),
            comment = mapToComment(dto.comment)
        )
    }

    private fun mapToComment(dto: ProposalCommentsDTO?): ProposalComment? {
        return if(dto == null) null
        else ProposalComment(
            id = dto.id,
            proposalId = dto.proposalId,
            authorId = dto.authorId,
            content = dto.content,
            commentType = dto.commentType
        )
    }

    override suspend fun mapModelToDTO(model: ProtocolAggregate?): ProtocolDTO {
        return if (model === null) ProtocolDTO()
        else ProtocolDTO(
            id = model.proposalProtocol!!.id,
            financialComponentId = model.proposalProtocol.financialComponentId,
            validated = model.proposalProtocol.validated,
            validatedDate = model.proposalProtocol.validatedDate
        )
    }
}