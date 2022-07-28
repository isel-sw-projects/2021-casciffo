package isel.casciffo.casciffospringbackend.aggregates.visits

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface PatientVisitsAggregateRepo: ReactiveCrudRepository<PatientVisitsAggregate, Int> {
}