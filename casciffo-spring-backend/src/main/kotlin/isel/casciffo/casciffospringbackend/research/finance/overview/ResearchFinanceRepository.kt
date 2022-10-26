package isel.casciffo.casciffospringbackend.research.finance.overview

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface ResearchFinanceRepository: ReactiveCrudRepository<ResearchFinance, Int> {
        fun findByResearchId(researchId: Int): Mono<ResearchFinance>
        fun existsByIdAndResearchId(id: Int, researchId: Int): Mono<Boolean>
        fun existsByResearchId(researchId: Int): Mono<Boolean>
}