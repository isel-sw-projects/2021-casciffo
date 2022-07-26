package isel.casciffo.casciffospringbackend.mappers

import isel.casciffo.casciffospringbackend.aggregates.comments.ProposalCommentsAggregate
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComment
import isel.casciffo.casciffospringbackend.users.user.UserModel
import org.springframework.stereotype.Component

@Component
class ProposalCommentsAggregateMapper : Mapper<ProposalComment, ProposalCommentsAggregate> {
    override suspend fun mapDTOtoModel(dto: ProposalCommentsAggregate?): ProposalComment {
        if (dto == null) return ProposalComment()
        return ProposalComment(
            id = dto.id,
            authorId = dto.authorId,
            commentType = dto.commentType,
            proposalId = dto.proposalId,
            createdDate = dto.createdDate,
            lastModified = dto.LastModified,
            content = dto.content,
            author = UserModel(
                userId = dto.authorId,
                name = dto.authorName,
                email = dto.authorEmail
            )
        )
    }

    override suspend fun mapModelToDTO(model: ProposalComment?): ProposalCommentsAggregate {
        throw NotImplementedError("Purposely left blank.")
    }
}