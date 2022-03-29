package isel.casciffo.casciffospringbackend.research

import isel.casciffo.casciffospringbackend.proposals.ResearchType
import kotlinx.coroutines.flow.Flow
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ResearchRepository: ReactiveSortingRepository<Research, Int> {

    fun findAllByType(type: ResearchType): Flux<Research>
}