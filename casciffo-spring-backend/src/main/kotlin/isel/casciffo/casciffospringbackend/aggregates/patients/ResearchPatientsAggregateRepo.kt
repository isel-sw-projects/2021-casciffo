package isel.casciffo.casciffospringbackend.aggregates.patients

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ResearchPatientsAggregateRepo: ReactiveCrudRepository<ResearchPatientsAggregate, Int> {
}