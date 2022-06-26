package isel.casciffo.casciffospringbackend.proposals.comments

import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.users.UserDTO
import isel.casciffo.casciffospringbackend.users.UserModel
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class ProposalCommentsMapper(
    @Autowired val userMapper: Mapper<UserModel, UserDTO>
): Mapper<ProposalComments, ProposalCommentsDTO> {
    override suspend fun mapDTOtoModel(dto: ProposalCommentsDTO?): ProposalComments {
        return ProposalComments(
            id = dto?.id,
            proposalId = dto?.proposalId,
            authorId = dto?.authorId,
            dateCreated = dto?.dateCreated,
            dateModified = dto?.dateModified,
            content = dto?.content,
            commentType = dto?.commentType,
            author = userMapper.mapDTOtoModel(dto?.author)
        )
    }

    override suspend fun mapModelToDTO(model: ProposalComments?): ProposalCommentsDTO {
        return ProposalCommentsDTO(
            id = model?.id,
            proposalId = model?.proposalId,
            authorId = model?.authorId,
            dateCreated = model?.dateCreated,
            dateModified = model?.dateModified,
            content = model?.content,
            commentType = model?.commentType,
            author = userMapper.mapModelToDTO(model?.author)
        )
    }
}