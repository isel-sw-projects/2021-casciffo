package isel.casciffo.casciffospringbackend.proposals.proposal_research

import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface ProposalResearchRepository: ReactiveCrudRepository<ProposalResearch, Int> {
}