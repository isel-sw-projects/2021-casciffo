package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.promoter.PromoterRepository
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ProposalFinancialServiceImpl(
    @Autowired val proposalFinancialRepository: ProposalFinancialRepository,
    @Autowired val promoterRepository: PromoterRepository,
    @Autowired val partnershipRepository: PartnershipRepository,
) : ProposalFinancialService {
    override suspend fun createProposalFinanceComponent(pfc: ProposalFinancialComponent): ProposalFinancialComponent {
        if(pfc.proposalId == null) throw IllegalArgumentException("Proposal Id must not be null here!!!")
        if(pfc.promoter == null && pfc.promoterId == null) throw IllegalArgumentException("Promoter must not be null here!!!")
        if(pfc.promoterId != null) {
            pfc.promoter = promoterRepository.findById(pfc.promoterId!!).awaitSingle()
        } else {
            pfc.promoter =  promoterRepository.save(pfc.promoter!!).awaitFirstOrNull()
        }
        if(pfc.partnerships != null)
            pfc.partnerships = partnershipRepository.findByFinanceComponentId(pfc.id!!).collectList().awaitSingle()
        val createdPfc = proposalFinancialRepository.save(pfc).awaitSingle()
        pfc.id = createdPfc.id
        return pfc
    }

    override suspend fun findComponentByProposalId(pid: Int): ProposalFinancialComponent {
        val component = proposalFinancialRepository.findByProposalId(pid).awaitFirstOrNull()
            ?: throw IllegalArgumentException("No financial component for provided proposal Id!!!")
        return loadRelations(component)
    }

    private suspend fun loadRelations(component: ProposalFinancialComponent): ProposalFinancialComponent {
        component.promoter = promoterRepository.findById(component.promoterId!!).awaitFirstOrNull()
        component.partnerships = partnershipRepository.findByFinanceComponentId(component.id!!).collectList().awaitSingle()
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