package isel.casciffo.casciffospringbackend.proposals.finance

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ProposalProtocolRepository: ReactiveCrudRepository<ProposalProtocol, Int> {
}