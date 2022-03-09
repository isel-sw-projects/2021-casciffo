package isel.casciffo.casciffospringbackend.proposals

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository


@Repository
interface PathologyRepository : ReactiveCrudRepository<Pathology, Int> {
}