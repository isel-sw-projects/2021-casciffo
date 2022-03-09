package isel.casciffo.casciffospringbackend.proposals

import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface ProposalService {
    fun getAllProposals(): Flux<Proposal>
    fun getProposalById(id: Int): Mono<Proposal>
}