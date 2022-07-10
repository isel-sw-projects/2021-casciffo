package isel.casciffo.casciffospringbackend.proposals.finance.finance

import isel.casciffo.casciffospringbackend.validations.ValidationComment
import kotlinx.coroutines.flow.Flow

interface ProposalFinancialService {
    suspend fun createProposalFinanceComponent(pfc: ProposalFinancialComponent) : ProposalFinancialComponent
    suspend fun findComponentByProposalId(pid: Int, loadProtocol: Boolean = false) : ProposalFinancialComponent

    suspend fun validate(pfcId: Int, validationComment: ValidationComment): ValidationComment
    suspend fun findAll(): Flow<ProposalFinancialComponent>
    suspend fun isValidated(pfcId: Int): Boolean
}