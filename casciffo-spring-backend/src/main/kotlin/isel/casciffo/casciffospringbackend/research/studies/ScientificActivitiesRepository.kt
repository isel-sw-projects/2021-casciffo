package isel.casciffo.casciffospringbackend.research.studies

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ScientificActivitiesRepository: ReactiveCrudRepository<ScientificActivity, Int> {
    fun findAllByResearchId(researchId: Int): Flux<ScientificActivity>
}