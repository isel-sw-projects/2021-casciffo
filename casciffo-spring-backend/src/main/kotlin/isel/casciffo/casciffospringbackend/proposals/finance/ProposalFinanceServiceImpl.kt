package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.promoter.PromoterRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class ProposalFinanceServiceImpl(
    @Autowired val proposalFinancialRepository: ProposalFinancialRepository,
    @Autowired val promoterRepository: PromoterRepository,
    @Autowired val partnershipRepository: PartnershipRepository
) : ProposalFinanceService {
    override fun createProposalFinanceComponent(pfc: ProposalFinancialComponent): Mono<ProposalFinancialComponent> {
        //FIXME NEED TO CHAIN TO PROPERLY INSERT VALUES, NEEDS A WAY TO CHAIN OR BLOCK
        val promoterMono = promoterRepository.save(pfc.promoter!!)
        val pfcMono = proposalFinancialRepository.save(pfc)
        val partnershipFlux = partnershipRepository.saveAll(pfc.partnerships!!)
        return pfcMono
    }

    override fun findComponentByProposalId(pid: Int): Mono<ProposalFinancialComponent> {
        return proposalFinancialRepository.findByProposalId(pid).flatMap(this::loadRelations)
    }

    private fun loadRelations(component: ProposalFinancialComponent): Mono<ProposalFinancialComponent> {
        return Mono.just(component)
            .zipWith(promoterRepository.findById(component.promoterId))
            .flatMap { it.t1.promoter = it.t2; return@flatMap Mono.just(it.t1) }
            .zipWith(partnershipRepository.findByFinanceComponentId(component.id!!).collectList())
            .flatMap { it.t1.partnerships = it.t2; return@flatMap Mono.just(it.t1) }
    }
}