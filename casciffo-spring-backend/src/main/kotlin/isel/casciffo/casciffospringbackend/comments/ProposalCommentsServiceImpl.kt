package isel.casciffo.casciffospringbackend.comments

import isel.casciffo.casciffospringbackend.users.UserService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

@Service
class ProposalCommentsServiceImpl(@Autowired val repository: ProposalCommentsRepository,
                                  @Autowired val userService: UserService)
    : ProposalCommentsService {
    override suspend fun createComment(comment: ProposalComments): ProposalComments? {
        if(comment.proposalId == null) {
            throw IllegalArgumentException("ProposalId cannot be null!!!")
        }
        return repository.save(comment).awaitSingleOrNull()
    }

    //fixme need a bit of thinking here
    override suspend fun updateComment(comment: ProposalComments): ProposalComments? {
        return repository.save(comment).awaitSingleOrNull()
    }

    override suspend fun getComments(proposalId: Int, page: PageRequest): Flow<ProposalComments>{
        return repository.findByProposalId(proposalId, page).asFlow().map(this::loadAuthor)
    }

    suspend fun loadAuthor(comment: ProposalComments): ProposalComments {
        comment.author = userService.getUser(comment.authorId!!)
        return comment
    }
}