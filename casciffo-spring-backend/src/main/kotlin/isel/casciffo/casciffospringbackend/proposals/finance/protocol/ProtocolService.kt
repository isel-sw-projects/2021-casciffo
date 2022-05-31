package isel.casciffo.casciffospringbackend.proposals.finance.protocol

interface ProtocolService {
    suspend fun findProtocolByProposalFinanceId(proposalId: Int, financeId: Int): ProposalProtocol
    suspend fun createProtocol(pfcId: Int): ProposalProtocol
    suspend fun updateProtocol(protocol: ProposalProtocol): ProposalProtocol
}