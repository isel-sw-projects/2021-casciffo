package isel.casciffo.casciffospringbackend.proposals.comments

import org.springframework.data.domain.Pageable
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ProposalCommentsRepository: ReactiveSortingRepository<ProposalComments, Int> {

    fun findByProposalId(id: Int, pageable: Pageable) : Flux<ProposalComments>


    fun findByProposalIdAndCommentType(id: Int, commentType: CommentType, pageable: Pageable) : Flux<ProposalComments>
}