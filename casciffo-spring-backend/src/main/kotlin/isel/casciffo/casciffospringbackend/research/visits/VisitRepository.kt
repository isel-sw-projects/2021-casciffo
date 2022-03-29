package isel.casciffo.casciffospringbackend.research.visits

import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository

@Repository
interface VisitRepository: ReactiveSortingRepository<Visit, Int> {

}