package isel.casciffo.casciffospringbackend.research.finance

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ResearchTeamMonetaryFlowRepository: ReactiveCrudRepository<ResearchTeamMonetaryFlow, Int> {
}