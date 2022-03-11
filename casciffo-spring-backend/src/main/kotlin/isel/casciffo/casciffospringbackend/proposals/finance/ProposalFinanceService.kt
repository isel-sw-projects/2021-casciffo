package isel.casciffo.casciffospringbackend.proposals.finance

import reactor.core.publisher.Mono

interface ProposalFinanceService {
    fun createProposalFinanceComponent(pfc: ProposalFinancialComponent) : Mono<ProposalFinancialComponent>
    fun findComponentByProposalId(pid: Int) : Mono<ProposalFinancialComponent>
}