package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.common.ResearchType
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ResearchRepository: ReactiveSortingRepository<ResearchModel, Int> {

    fun findAllByType(type: ResearchType): Flux<ResearchModel>
}