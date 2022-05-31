package isel.casciffo.casciffospringbackend.proposals.comments

import kotlinx.coroutines.flow.Flow
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable

interface ProposalCommentsService {
    suspend fun createComment(comment: ProposalComments): ProposalComments
    suspend fun updateComment(comment: ProposalComments): ProposalComments
    suspend fun getComments(proposalId: Int, page: Pageable): Flow<ProposalComments>
    suspend fun getCommentsByType(proposalId: Int, type: String, page: Pageable): Flow<ProposalComments>
}