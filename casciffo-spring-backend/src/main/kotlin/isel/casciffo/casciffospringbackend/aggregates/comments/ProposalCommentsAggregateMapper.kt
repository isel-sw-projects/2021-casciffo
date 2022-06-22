package isel.casciffo.casciffospringbackend.aggregates.comments

import isel.casciffo.casciffospringbackend.Mapper
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComments
import isel.casciffo.casciffospringbackend.users.UserModel

class ProposalCommentsAggregateMapper : Mapper<ProposalComments, ProposalCommentsAggregate> {
    override suspend fun mapDTOtoModel(dto: ProposalCommentsAggregate?): ProposalComments {
        if (dto == null) return ProposalComments()
        return ProposalComments(
            id = dto.id,
            authorId = dto.authorId,
            commentType = dto.commentType,
            proposalId = dto.proposalId,
            dateCreated = dto.dateCreated,
            dateModified = dto.dateModified,
            content = dto.content,
            author = UserModel(
                userId = dto.authorId,
                name = dto.authorName,
                email = dto.authorEmail
            )
        )
    }

    override suspend fun mapModelToDTO(model: ProposalComments?): ProposalCommentsAggregate {
        throw NotImplementedError("Purposely left blank.")
    }
}