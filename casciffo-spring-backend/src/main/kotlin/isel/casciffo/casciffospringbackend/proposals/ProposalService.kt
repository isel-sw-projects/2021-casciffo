package isel.casciffo.casciffospringbackend.proposals

import kotlinx.coroutines.flow.Flow

interface ProposalService {
    suspend fun getAllProposals(type: ResearchType): Flow<Proposal>
    suspend fun getProposalById(id: Int): Proposal
    suspend fun create(proposal: Proposal) : Proposal
    suspend fun updateProposal(proposal: Proposal) : Proposal
    //suspend fun newState(proposalId: Int, newStateId: Int): Proposal
}