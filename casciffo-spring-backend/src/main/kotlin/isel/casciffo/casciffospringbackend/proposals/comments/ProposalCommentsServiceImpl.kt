package isel.casciffo.casciffospringbackend.proposals.comments

import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.aggregates.comments.ProposalCommentsAggregate
import isel.casciffo.casciffospringbackend.aggregates.comments.ProposalCommentsAggregateRepo
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class ProposalCommentsServiceImpl(
    @Autowired val repository: ProposalCommentsRepository,
    @Autowired val aggregateRepo: ProposalCommentsAggregateRepo,
    @Autowired val mapper: Mapper<ProposalComments, ProposalCommentsAggregate>
    )
    : ProposalCommentsService {
    override suspend fun createComment(comment: ProposalComments): ProposalComments {
        if(comment.proposalId == null) {
            throw IllegalArgumentException("ProposalId cannot be null!!!")
        }
        comment.dateCreated = LocalDateTime.now()
        return repository.save(comment)
            .map {
                it.author = comment.author
                it
            }.awaitSingle()
    }

    //fixme need a bit of thinking here
    override suspend fun updateComment(comment: ProposalComments): ProposalComments {
        return repository.save(comment).awaitSingle()
    }

    override suspend fun getComments(proposalId: Int, page: Pageable): Flow<ProposalComments>{
        return aggregateRepo
                    .findByProposalId(proposalId, page.pageNumber, page.pageSize)
                    .asFlow()
                    .map(mapper::mapDTOtoModel)
    }

    override suspend fun getCommentsByType(proposalId: Int, type: String, page: Pageable): Flow<ProposalComments> {
        return aggregateRepo
            .findByProposalIdAndCommentType(proposalId, CommentType.valueOf(type), page.pageNumber, page.pageSize)
            .asFlow()
            .map(mapper::mapDTOtoModel)
    }
}