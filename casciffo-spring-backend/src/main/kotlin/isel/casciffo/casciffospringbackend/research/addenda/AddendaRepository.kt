package isel.casciffo.casciffospringbackend.research.addenda

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface AddendaRepository: ReactiveCrudRepository<Addenda, Int> {
    fun findByResearchId(researchId: Int): Mono<Addenda>
}