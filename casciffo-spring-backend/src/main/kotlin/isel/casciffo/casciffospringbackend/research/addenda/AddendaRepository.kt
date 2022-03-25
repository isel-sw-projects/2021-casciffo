package isel.casciffo.casciffospringbackend.research.addenda

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface AddendaRepository: ReactiveCrudRepository<Addenda, Int> {
}