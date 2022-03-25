package isel.casciffo.casciffospringbackend.visits.investigators

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface VisitInvestigatorsRepository: ReactiveCrudRepository<VisitInvestigators, Int> {
    fun findAllByVisitId(visitId: Int) : Flux<VisitInvestigators>
}