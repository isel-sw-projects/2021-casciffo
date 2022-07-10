package isel.casciffo.casciffospringbackend.proposals.finance.finance

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface ProposalFinancialRepository : ReactiveCrudRepository<ProposalFinancialComponent, Int> {
    fun findByProposalId(id: Int): Mono<ProposalFinancialComponent>
}