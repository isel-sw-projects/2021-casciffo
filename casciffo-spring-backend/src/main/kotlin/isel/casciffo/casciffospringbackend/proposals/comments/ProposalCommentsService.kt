package isel.casciffo.casciffospringbackend.proposals.comments

import isel.casciffo.casciffospringbackend.common.CommentType
import kotlinx.coroutines.flow.Flow
import org.springframework.data.domain.Pageable

interface ProposalCommentsService {
    suspend fun createComment(comment: ProposalComment): ProposalComment
    suspend fun updateComment(comment: ProposalComment): ProposalComment
    suspend fun getComments(proposalId: Int, page: Pageable): Flow<ProposalComment>
    suspend fun getCommentsByType(proposalId: Int, type: CommentType, page: Pageable): Flow<ProposalComment>
}