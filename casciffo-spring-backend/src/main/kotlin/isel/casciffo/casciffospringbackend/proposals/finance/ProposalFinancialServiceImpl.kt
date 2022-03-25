package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.promoter.PromoterRepository
import isel.casciffo.casciffospringbackend.proposals.Proposal
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class ProposalFinancialServiceImpl(
    @Autowired val proposalFinancialRepository: ProposalFinancialRepository,
    @Autowired val promoterRepository: PromoterRepository,
    @Autowired val partnershipRepository: PartnershipRepository,
) : ProposalFinancialService {
    override suspend fun createProposalFinanceComponent(pfc: ProposalFinancialComponent): ProposalFinancialComponent {
        if(pfc.proposalId == null) throw IllegalArgumentException("Proposal Id must not be null here!!!")
        pfc.promoter = promoterRepository.save(pfc.promoter!!).awaitFirstOrNull()
        pfc.partnerships = partnershipRepository.findByFinanceComponentId(pfc.id!!)
        return pfc
    }

    override suspend fun findComponentByProposalId(pid: Int): ProposalFinancialComponent {
        val component = proposalFinancialRepository.findByProposalId(pid).awaitFirstOrNull()
            ?: throw IllegalArgumentException("No financial component for provided proposal Id!!!")
        return loadRelations(component)
    }

    private suspend fun loadRelations(component: ProposalFinancialComponent): ProposalFinancialComponent {
        component.promoter = promoterRepository.findById(component.promoterId!!).awaitFirstOrNull()
        component.partnerships = partnershipRepository.findByFinanceComponentId(component.id!!)
        return component
    }

}

//    FLUX MONO SYNTAX
//    override fun createProposalFinanceComponent(pfc: ProposalFinancialComponent): Mono<ProposalFinancialComponent> {
//        if(pfc.proposalId == null) throw IllegalArgumentException("Proposal Id must not be null here!!!")
//
//        var mono = Mono.just(pfc)
//        if(pfc.financialContractId != null) {
//            //create financial contract here
//            //mono = mono.zipWith()
//        }
//
//        return promoterRepository
//            .save(pfc.promoter!!)
//            .map {
//                pfc.promoterId = it.id
//                proposalFinancialRepository.save(pfc)
//            }
//            .flatMap { partnershipRepository
//                    .saveAll(pfc.partnerships!!)
//                    .collectList()
//            }
//            .map {
//                pfc.partnerships = it
//                pfc
//            }
//    }
//
//    override fun findComponentByProposalId(pid: Int): Mono<ProposalFinancialComponent> {
//        return proposalFinancialRepository.findByProposalId(pid).flatMap(this::loadRelations)
//    }
//
//
//    private fun loadRelations(component: ProposalFinancialComponent): Mono<ProposalFinancialComponent> {
//        return promoterRepository.findById(component.promoterId!!)
//            .flatMap {
//                component.promoter = it
//                partnershipRepository.findByFinanceComponentId(component.id!!).collectList()
//            }
//            .map {
//                component.partnerships = it
//                component
//            }
//    }