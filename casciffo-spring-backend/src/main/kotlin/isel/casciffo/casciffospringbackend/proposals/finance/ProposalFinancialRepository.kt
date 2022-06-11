package isel.casciffo.casciffospringbackend.proposals.finance

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface ProposalFinancialRepository : ReactiveCrudRepository<ProposalFinancialComponent, Int> {
//    @Query("select pfc.* from proposal_financial_component pfc " +
//            "join proposal p on p.proposal_id = pfc.proposal_id " +
//            "where p.proposal_id = :id")
    fun findByProposalId(id: Int): Mono<ProposalFinancialComponent>
}