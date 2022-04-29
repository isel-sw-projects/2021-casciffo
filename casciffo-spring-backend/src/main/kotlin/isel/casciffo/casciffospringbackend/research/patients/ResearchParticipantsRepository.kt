package isel.casciffo.casciffospringbackend.research.patients

import kotlinx.coroutines.flow.Flow
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ResearchParticipantsRepository: ReactiveSortingRepository<ResearchParticipants, Int> {

    fun findAllByResearchId(researchId: Int) : Flux<ResearchParticipants>
}