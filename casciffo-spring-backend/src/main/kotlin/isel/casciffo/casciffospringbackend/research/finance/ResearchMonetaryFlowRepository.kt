package isel.casciffo.casciffospringbackend.research.finance

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ResearchMonetaryFlowRepository: ReactiveCrudRepository<ResearchMonetaryFlow, Int> {
}