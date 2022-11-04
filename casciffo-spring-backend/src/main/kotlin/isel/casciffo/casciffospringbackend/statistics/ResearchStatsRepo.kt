package isel.casciffo.casciffospringbackend.statistics

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface ResearchStatsRepo: ReactiveCrudRepository<ResearchStats, Int> {

    @Query(
        "SELECT COUNT(*) total_count, " +
                "COUNT(*) FILTER ( WHERE s.state_name = 'COMPLETO' ) number_of_completed, " +
                "COUNT(*) FILTER ( WHERE s.state_name = 'ATIVO' ) number_of_active, " +
                "COUNT(*) FILTER ( WHERE s.state_name = 'CANCELADO' ) number_of_canceled, " +
                "r.type as research_type " +
                "FROM clinical_research r " +
                "JOIN states s on r.research_state_id = s.state_id " +
                "GROUP BY r.type"
    )
    fun findResearchStats(): Flux<ResearchStats>
}