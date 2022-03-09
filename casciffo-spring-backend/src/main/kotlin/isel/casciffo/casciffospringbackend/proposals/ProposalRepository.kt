package isel.casciffo.casciffospringbackend.proposals

import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository

@Repository
interface ProposalRepository : ReactiveSortingRepository<Proposal, Int> {

}