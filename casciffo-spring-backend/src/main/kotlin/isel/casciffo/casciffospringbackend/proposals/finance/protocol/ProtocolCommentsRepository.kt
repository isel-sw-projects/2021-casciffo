package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface ProtocolCommentsRepository: ReactiveCrudRepository<ProtocolComments, Int> {
    fun findAllByProtocolId(pId: Int): Flux<ProtocolComments>
}