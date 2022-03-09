package isel.casciffo.casciffospringbackend.proposals

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface ProposalFinancialComponentRepository : ReactiveCrudRepository<ProposalFinancialComponent, Int> {
    @Query("select pfc.* from proposal_financial_component pfc " +
            "join proposal p on p.proposal_id = pfc.proposal_id " +
            "where p.proposal_id = :id")
    fun findByProposalId(id: Int): Mono<ProposalFinancialComponent>
}