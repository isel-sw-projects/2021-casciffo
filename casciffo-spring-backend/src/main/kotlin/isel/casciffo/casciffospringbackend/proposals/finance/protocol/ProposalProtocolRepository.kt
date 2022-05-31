package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface ProposalProtocolRepository: ReactiveCrudRepository<ProposalProtocol, Int> {
    fun findByFinancialComponentId(financialComponentId: Int): Mono<ProposalProtocol>
}