package isel.casciffo.casciffospringbackend.research.finance.team_monetary_flow

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ResearchTeamMonetaryFlowRepository: ReactiveCrudRepository<ResearchTeamMonetaryFlow, Int> {

    fun findByRfcId(rfcId: Int): Flux<ResearchTeamMonetaryFlow>

}