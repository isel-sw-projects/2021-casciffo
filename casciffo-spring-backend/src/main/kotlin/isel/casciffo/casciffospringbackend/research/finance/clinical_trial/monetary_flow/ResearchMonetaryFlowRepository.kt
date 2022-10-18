package isel.casciffo.casciffospringbackend.research.finance.clinical_trial.monetary_flow

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ResearchMonetaryFlowRepository: ReactiveCrudRepository<ResearchMonetaryFlow, Int> {
    fun findByResearchFinancialComponentId(rfcId: Int): Flux<ResearchMonetaryFlow>
}