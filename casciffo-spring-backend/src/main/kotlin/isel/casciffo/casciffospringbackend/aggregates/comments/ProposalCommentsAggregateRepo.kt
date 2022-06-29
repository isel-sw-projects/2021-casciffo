package isel.casciffo.casciffospringbackend.aggregates.comments

import isel.casciffo.casciffospringbackend.common.CommentType
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import reactor.core.publisher.Flux

interface ProposalCommentsAggregateRepo : ReactiveSortingRepository<ProposalCommentsAggregate, Int> {

    @Query(
        "SELECT c.*, u.user_name, u.user_email " +
        "FROM proposal_comments c " +
        "JOIN user_account u ON u.user_id = c.author_id " +
        "WHERE c.proposal_id = :proposalId " +
        "OFFSET :page LIMIT :numOfElems"
    )
    fun findByProposalId(proposalId: Int, page:Int, numOfElems: Int): Flux<ProposalCommentsAggregate>

    @Query(
        "SELECT c.*, u.user_name, u.user_email " +
        "FROM proposal_comments c " +
        "JOIN user_account u ON u.user_id = c.author_id " +
        "WHERE c.proposal_id = :proposalId AND c.comment_type = :type " +
        "OFFSET :page LIMIT :numOfElems"
    )
    fun findByProposalIdAndCommentType(proposalId: Int, type: CommentType, page:Int, numOfElems: Int): Flux<ProposalCommentsAggregate>
}