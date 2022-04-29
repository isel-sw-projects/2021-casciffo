package isel.casciffo.casciffospringbackend.proposals.finance

interface ProposalFinancialService {
    suspend fun createProposalFinanceComponent(pfc: ProposalFinancialComponent) : ProposalFinancialComponent
    suspend fun findComponentByProposalId(pid: Int) : ProposalFinancialComponent
}