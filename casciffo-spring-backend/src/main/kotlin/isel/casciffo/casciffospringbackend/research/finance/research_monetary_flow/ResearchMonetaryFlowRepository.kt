package isel.casciffo.casciffospringbackend.research.finance.research_monetary_flow

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ResearchMonetaryFlowRepository: ReactiveCrudRepository<ResearchMonetaryFlow, Int> {
    fun findByRfcId(rfcId: Int): Flux<ResearchMonetaryFlow>
}