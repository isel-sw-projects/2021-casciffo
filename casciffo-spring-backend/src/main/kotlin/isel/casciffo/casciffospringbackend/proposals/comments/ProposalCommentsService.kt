package isel.casciffo.casciffospringbackend.proposals.comments

import kotlinx.coroutines.flow.Flow
import org.springframework.data.domain.PageRequest

interface ProposalCommentsService {
    suspend fun createComment(comment: ProposalComments): ProposalComments?
    suspend fun updateComment(comment: ProposalComments): ProposalComments?
    suspend fun getComments(proposalId: Int, page: PageRequest): Flow<ProposalComments>
}