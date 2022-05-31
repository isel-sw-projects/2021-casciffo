package isel.casciffo.casciffospringbackend.proposals

import kotlinx.coroutines.flow.Flow

interface ProposalService {
    suspend fun getAllProposals(type: ResearchType): Flow<ProposalModel>
    suspend fun getProposalById(id: Int): ProposalModel
    suspend fun create(proposal: ProposalModel) : ProposalModel
    suspend fun updateProposal(proposal: ProposalModel) : ProposalModel
    suspend fun deleteProposal(proposalId: Int): ProposalModel
    suspend fun advanceState(proposalId: Int, forward: Boolean): ProposalModel
}