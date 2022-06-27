package isel.casciffo.casciffospringbackend.proposals.finance.promoter

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface PromoterRepository : ReactiveCrudRepository<Promoter, Int> {
    fun findByEmail(email: String): Mono<Promoter>
}