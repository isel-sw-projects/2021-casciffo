package isel.casciffo.casciffospringbackend.proposals.finance.partnership

import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface PartnershipService {

    fun findAllByProposalFinancialComponentId(pfcId: Int): Flux<Partnership>
    fun saveAll(partnerships: Flux<Partnership>) : Flux<Partnership>
    fun save(partnership: Partnership) : Mono<Partnership>
    fun findByNameAndEmail(name: String, email: String): Mono<Partnership>
}