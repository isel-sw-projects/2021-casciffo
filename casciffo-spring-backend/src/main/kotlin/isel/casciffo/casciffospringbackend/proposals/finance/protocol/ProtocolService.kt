package isel.casciffo.casciffospringbackend.proposals.finance.protocol

interface ProtocolService {
    suspend fun getProtocolDetails(proposalId: Int, financeId: Int, loadComments: Boolean = false): ProtocolAndCommentsDTO
    suspend fun createProtocol(pfcId: Int): ProposalProtocol
    suspend fun handleNewProtocolComment(proposalId: Int, pfcId: Int,aggregate: ProtocolAggregate): ProposalProtocol
}