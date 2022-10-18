package isel.casciffo.casciffospringbackend.aggregates.research_finance

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ResearchTeamFinanceEntryAggregateRepo: ReactiveSortingRepository<ResearchTeamFinanceEntryAggregate, Int> {

    @Query(
        "SELECT rtfs.*, ua.user_email, ua.user_name " +
        "FROM research_team_financial_scope rtfs " +
        "JOIN user_account ua on rtfs.investigator_id = ua.user_id " +
        "WHERE rtfs.trial_financial_component_id=:rfcId"
    )
    fun findAllByFinancialComponentId(rfcId: Int): Flux<ResearchTeamFinanceEntryAggregate>
}