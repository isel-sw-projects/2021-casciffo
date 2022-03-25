package isel.casciffo.casciffospringbackend.proposals

import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface ProposalService {
    suspend fun getAllProposals(type: ProposalType): Flow<Proposal>
    suspend fun getProposalById(id: Int): Proposal
    suspend fun create(proposal: Proposal) : Proposal
    //suspend fun newState(proposalId: Int, newStateId: Int): Proposal
}