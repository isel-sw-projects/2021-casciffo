package isel.casciffo.casciffospringbackend.proposals.finance.partnership

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface PartnershipRepository: ReactiveCrudRepository<Partnership, Int>{
    fun findByFinanceComponentId(id: Int): Flux<Partnership>
    fun findAllByEmailIsAndNameIs(email: String, name: String): Mono<Partnership>
}