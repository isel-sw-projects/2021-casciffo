package isel.casciffo.casciffospringbackend.proposals.finance

import kotlinx.coroutines.flow.Flow

interface ProposalFinancialService {
    suspend fun createProposalFinanceComponent(pfc: ProposalFinancialComponent) : ProposalFinancialComponent
    suspend fun findComponentByProposalId(pid: Int, loadProtocol: Boolean = false) : ProposalFinancialComponent
    suspend fun findAll(): Flow<ProposalFinancialComponent>
}