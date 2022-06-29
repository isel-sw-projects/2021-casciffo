package isel.casciffo.casciffospringbackend.proposals.comments

import isel.casciffo.casciffospringbackend.aggregates.comments.ProposalCommentsAggregate
import isel.casciffo.casciffospringbackend.aggregates.comments.ProposalCommentsAggregateRepo
import isel.casciffo.casciffospringbackend.common.CommentType
import isel.casciffo.casciffospringbackend.mappers.Mapper
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
    @Autowired val aggregateRepo: ProposalCommentsAggregateRepo,
    @Autowired val mapper: Mapper<ProposalComment, ProposalCommentsAggregate>
    )
    : ProposalCommentsService {
    override suspend fun createComment(comment: ProposalComment): ProposalComment {
        if(comment.proposalId == null) {
            throw IllegalArgumentException("ProposalId cannot be null!!!")
        }

        return repository.save(comment)
            .map {
                it.author = comment.author
                it
            }.awaitSingle()
    }

    //fixme need a bit of thinking here
    override suspend fun updateComment(comment: ProposalComment): ProposalComment {
        return repository.save(comment).awaitSingle()
    }

    override suspend fun getComments(proposalId: Int, page: Pageable): Flow<ProposalComment>{
        return aggregateRepo
                    .findByProposalId(proposalId, page.pageNumber, page.pageSize)
                    .asFlow()
                    .map(mapper::mapDTOtoModel)
    }

    override suspend fun getCommentsByType(proposalId: Int, type: CommentType, page: Pageable): Flow<ProposalComment> {
        return aggregateRepo
            .findByProposalIdAndCommentType(proposalId, type, page.pageNumber, page.pageSize)
            .asFlow()
            .map(mapper::mapDTOtoModel)
    }
}