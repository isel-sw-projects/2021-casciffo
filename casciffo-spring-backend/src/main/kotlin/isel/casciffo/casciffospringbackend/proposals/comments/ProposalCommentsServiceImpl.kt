package isel.casciffo.casciffospringbackend.proposals.comments

import isel.casciffo.casciffospringbackend.users.UserService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class ProposalCommentsServiceImpl(
    @Autowired val repository: ProposalCommentsRepository,
    @Autowired val userService: UserService
    )
    : ProposalCommentsService {
    override suspend fun createComment(comment: ProposalComments): ProposalComments {
        if(comment.proposalId == null) {
            throw IllegalArgumentException("ProposalId cannot be null!!!")
        }
        //fixme this is a temp fix requires a look at @CreatedDate annotation
        val savedComment = repository.save(comment).awaitSingle()
        return loadAuthor(repository.findById(savedComment.id!!).awaitSingle())
    }

    //fixme need a bit of thinking here
    override suspend fun updateComment(comment: ProposalComments): ProposalComments {
        return repository.save(comment).awaitSingle()
    }

    override suspend fun getComments(proposalId: Int, page: Pageable): Flow<ProposalComments>{
        return repository.findByProposalId(proposalId, page).asFlow().map(this::loadAuthor)
    }

    override suspend fun getCommentsByType(proposalId: Int, type: String, page: Pageable): Flow<ProposalComments> {
        return repository.findByProposalIdAndCommentType(proposalId, CommentType.valueOf(type), page).asFlow()
    }

    suspend fun loadAuthor(comment: ProposalComments): ProposalComments {
        comment.author = userService.getUser(comment.authorId!!)
        return comment
    }
}