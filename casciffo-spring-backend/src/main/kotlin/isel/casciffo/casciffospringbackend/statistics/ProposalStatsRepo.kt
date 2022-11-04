package isel.casciffo.casciffospringbackend.statistics

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface ProposalStatsRepo: ReactiveCrudRepository<ProposalStats, Int> {

    @Query(
        "SELECT COUNT(*) total_count, " +
                "COUNT(*) FILTER ( WHERE s.state_name = 'VALIDADO' ) number_of_concluded, " +
                "COUNT(*) FILTER ( WHERE s.state_name = 'SUBMETIDO' ) number_of_submitted, " +
                "p.proposal_type as research_type " +
        "FROM proposal p " +
        "JOIN states s on p.state_id = s.state_id " +
        "GROUP BY p.proposal_type"
    )
    fun findProposalStats(): Flux<ProposalStats>
}