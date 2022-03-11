package isel.casciffo.casciffospringbackend.proposals.finance

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface PartnershipRepository: ReactiveCrudRepository<Partnership, Int>{
    fun findByFinanceComponentId(id: Int): Flux<Partnership>
}