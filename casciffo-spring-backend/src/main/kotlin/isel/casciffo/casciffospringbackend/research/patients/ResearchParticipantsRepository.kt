package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ResearchParticipantsRepository: ReactiveSortingRepository<ResearchPatients, Int> {

    fun findAllByResearchId(researchId: Int) : Flux<ResearchPatients>
}