package isel.casciffo.casciffospringbackend.research.studies

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ScientificActiviesRepository: ReactiveCrudRepository<ScientificActivities, Int> {
}