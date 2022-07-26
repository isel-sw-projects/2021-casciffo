package isel.casciffo.casciffospringbackend.aggregates.research

import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface ResearchDetailAggregateRepo: ReactiveCrudRepository<ResearchDetailAggregate, Int> {
}