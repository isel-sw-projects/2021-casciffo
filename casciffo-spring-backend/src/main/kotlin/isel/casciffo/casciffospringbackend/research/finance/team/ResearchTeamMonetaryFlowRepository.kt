package isel.casciffo.casciffospringbackend.research.finance.team

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ResearchTeamMonetaryFlowRepository: ReactiveCrudRepository<ResearchTeamMonetaryFlow, Int> {

    fun findByFinancialComponentId(rfcId: Int): Flux<ResearchTeamMonetaryFlow>

}