package isel.casciffo.casciffospringbackend.mappers

import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComment
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsDTO
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProposalProtocol
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolAggregate
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class ProtocolAggregateMapper(
    @Autowired val commentMapper: Mapper<ProposalComment, ProposalCommentsDTO>
) : Mapper<ProtocolAggregate, ProtocolDTO> {
    override suspend fun mapDTOtoModel(dto: ProtocolDTO?): ProtocolAggregate {
        return if (dto === null) ProtocolAggregate()
        else ProtocolAggregate(
            newValidation = dto.newValidation,
            protocol = ProposalProtocol(
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
            id = model.protocol!!.id,
            financialComponentId = model.protocol.financialComponentId,
            validated = model.protocol.validated,
            validatedDate = model.protocol.validatedDate,
            commentRef = model.protocol.commentRef,
            comment = commentMapper.mapModelToDTO(model.comment)
        )
    }
}