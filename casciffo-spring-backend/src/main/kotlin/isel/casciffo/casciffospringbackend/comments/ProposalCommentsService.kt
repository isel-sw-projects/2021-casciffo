package isel.casciffo.casciffospringbackend.comments

import kotlinx.coroutines.flow.Flow
import org.springframework.data.domain.PageRequest
import reactor.core.publisher.Flux

interface ProposalCommentsService {
    suspend fun createComment(comment: ProposalComments): ProposalComments?
    suspend fun updateComment(comment: ProposalComments): ProposalComments?
    suspend fun getComments(proposalId: Int, page: PageRequest): Flow<ProposalComments>
}