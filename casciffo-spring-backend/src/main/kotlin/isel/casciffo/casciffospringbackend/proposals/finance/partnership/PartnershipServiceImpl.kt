package isel.casciffo.casciffospringbackend.proposals.finance.partnership

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class PartnershipServiceImpl(
    @Autowired val repo: PartnershipRepository
) : PartnershipService {
    override fun findAllByProposalFinancialComponentId(pfcId: Int): Flux<Partnership> {
        return repo.findByFinanceComponentId(pfcId)
    }

    override fun saveAll(partnerships: Flux<Partnership>): Flux<Partnership> {
        return repo.saveAll(partnerships)
    }

    override fun save(partnership: Partnership): Mono<Partnership> {
        return repo.save(partnership)
    }
}