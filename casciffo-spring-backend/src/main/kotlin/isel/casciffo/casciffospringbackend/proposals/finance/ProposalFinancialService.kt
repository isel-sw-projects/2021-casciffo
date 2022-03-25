package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.proposals.Proposal
import reactor.core.publisher.Mono

interface ProposalFinancialService {
    suspend fun createProposalFinanceComponent(pfc: ProposalFinancialComponent) : ProposalFinancialComponent
    suspend fun findComponentByProposalId(pid: Int) : ProposalFinancialComponent
}