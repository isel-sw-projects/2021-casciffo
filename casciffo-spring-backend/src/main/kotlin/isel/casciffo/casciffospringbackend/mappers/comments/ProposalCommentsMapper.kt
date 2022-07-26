package isel.casciffo.casciffospringbackend.mappers

import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComment
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsDTO
import isel.casciffo.casciffospringbackend.users.user.UserDTO
import isel.casciffo.casciffospringbackend.users.user.UserModel
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class ProposalCommentsMapper(
    @Autowired val userMapper: Mapper<UserModel, UserDTO>
): Mapper<ProposalComment, ProposalCommentsDTO> {
    override suspend fun mapDTOtoModel(dto: ProposalCommentsDTO?): ProposalComment {
        return ProposalComment(
            id = dto?.id,
            proposalId = dto?.proposalId,
            authorId = dto?.authorId,
            createdDate = dto?.createdDate,
            lastModified = dto?.lastModified,
            content = dto?.content,
            commentType = dto?.commentType,
            author = userMapper.mapDTOtoModel(dto?.author)
        )
    }

    override suspend fun mapModelToDTO(model: ProposalComment?): ProposalCommentsDTO {
        return ProposalCommentsDTO(
            id = model?.id,
            proposalId = model?.proposalId,
            authorId = model?.authorId,
            createdDate = model?.createdDate,
            lastModified = model?.lastModified,
            content = model?.content,
            commentType = model?.commentType,
            author = userMapper.mapModelToDTO(model?.author)
        )
    }
}