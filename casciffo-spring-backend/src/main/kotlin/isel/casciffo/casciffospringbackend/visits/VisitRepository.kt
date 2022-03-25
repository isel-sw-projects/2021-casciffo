package isel.casciffo.casciffospringbackend.visits

import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository

@Repository
interface VisitRepository: ReactiveSortingRepository<Visit, Int> {

}