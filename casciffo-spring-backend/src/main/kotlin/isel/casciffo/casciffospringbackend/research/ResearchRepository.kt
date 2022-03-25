package isel.casciffo.casciffospringbackend.research

import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository

@Repository
interface ResearchRepository: ReactiveSortingRepository<Research, Int> {
}