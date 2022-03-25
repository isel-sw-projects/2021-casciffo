package isel.casciffo.casciffospringbackend.proposals

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ProposalRepository : ReactiveSortingRepository<Proposal, Int> {

    @Query("SELECT p.* from proposal p where p.proposal_type=:type")
    fun findAllByType(type: ProposalType) : Flux<Proposal>
}