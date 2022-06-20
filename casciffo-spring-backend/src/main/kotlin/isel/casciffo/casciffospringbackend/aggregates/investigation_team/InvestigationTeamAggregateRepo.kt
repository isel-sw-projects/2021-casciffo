package isel.casciffo.casciffospringbackend.aggregates.investigation_team

import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface InvestigationTeamAggregateRepo: ReactiveCrudRepository<InvestigationTeamAggregate, Int> {

}