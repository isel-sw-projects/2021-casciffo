package isel.casciffo.casciffospringbackend.proposal_research

import isel.casciffo.casciffospringbackend.proposals.proposal.ProposalRepository
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono

interface ProposalResearchRepository: ReactiveCrudRepository<ProposalResearch, Int> {
    fun findByProposalId(proposalId: Int): Mono<ProposalResearch>
    fun findByResearchId(researchId: Int): Mono<ProposalResearch>
}