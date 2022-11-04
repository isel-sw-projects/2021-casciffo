package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.validations.ValidationComment

interface ProtocolService {
    suspend fun getProtocolDetails(proposalId: Int, financeId: Int, loadComments: Boolean = false): ProtocolAndCommentsDTO
    suspend fun createProtocol(pfcId: Int): ProposalProtocol
    suspend fun handleNewProtocolComment(proposalId: Int, pfcId: Int,validationComment: ValidationComment): ProtocolAggregate
}