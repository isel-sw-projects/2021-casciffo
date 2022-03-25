package isel.casciffo.casciffospringbackend.comments

import org.springframework.data.domain.PageRequest
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ProposalCommentsRepository: ReactiveSortingRepository<ProposalComments, Int> {
    @Query("select pc.* from proposal_comments pc " +
            "join proposal p on pc.proposal_id = p.proposal_id " +
            "where p.proposal_id = :id")
    fun findByProposalId(id: Int, pageRequest: PageRequest) : Flux<ProposalComments>
}