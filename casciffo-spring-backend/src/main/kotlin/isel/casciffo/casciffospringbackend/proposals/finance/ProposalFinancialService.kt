package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.proposals.Proposal
import reactor.core.publisher.Mono

interface ProposalFinancialService {
    fun createProposalFinanceComponent(pfc: ProposalFinancialComponent) : Mono<ProposalFinancialComponent>
    fun findComponentByProposalId(pid: Int) : Mono<ProposalFinancialComponent>
}