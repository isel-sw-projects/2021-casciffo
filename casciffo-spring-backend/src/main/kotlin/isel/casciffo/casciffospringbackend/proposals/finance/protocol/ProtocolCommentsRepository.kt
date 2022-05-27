package isel.casciffo.casciffospringbackend.proposals.comments

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ProtocolCommentsRepository: ReactiveCrudRepository<ProtocolComments, Int> {
}