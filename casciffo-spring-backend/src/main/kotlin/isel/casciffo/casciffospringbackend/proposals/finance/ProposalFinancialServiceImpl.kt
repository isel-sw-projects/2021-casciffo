package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.promoter.PromoterRepository
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProposalProtocolRepository
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux

@Service
class ProposalFinancialServiceImpl(
    @Autowired val proposalFinancialRepository: ProposalFinancialRepository,
    @Autowired val promoterRepository: PromoterRepository,
    @Autowired val partnershipRepository: PartnershipRepository,
    @Autowired val protocolService: ProtocolService
) : ProposalFinancialService {

    @Transactional
    override suspend fun createProposalFinanceComponent(pfc: ProposalFinancialComponent): ProposalFinancialComponent {
        //assure id is null and not default 0 for entity creation
        pfc.id = null

        verifyAndCreatePromoter(pfc)

        val createdPfc = proposalFinancialRepository.save(pfc).awaitSingle()
        if(pfc.partnerships != null) {
            createPartnerships(pfc, createdPfc)
        }

        pfc.protocol = protocolService.createProtocol(pfc.id!!)

        pfc.id = createdPfc.id
        return pfc
    }

    private fun createPartnerships(
        pfc: ProposalFinancialComponent,
        createdPfc: ProposalFinancialComponent
    ) {
        pfc.partnerships = partnershipRepository.saveAll(
            pfc.partnerships!!.map {
                it.financeComponentId = createdPfc.id!!
                it
            }
        )
    }

    private suspend fun verifyAndCreatePromoter(pfc: ProposalFinancialComponent) {
        if (pfc.proposalId == null) throw IllegalArgumentException("Proposal Id must not be null here!!!")
        if (pfc.promoter == null && pfc.promoterId == null) throw IllegalArgumentException("Promoter must not be null here!!!")
        if (pfc.promoterId == null) {
            pfc.promoter = promoterRepository.save(pfc.promoter!!).awaitSingle()
            pfc.promoterId = pfc.promoter!!.id!!
        }
    }

    override suspend fun findComponentByProposalId(pid: Int, loadProtocol: Boolean): ProposalFinancialComponent {
        val component = proposalFinancialRepository.findByProposalId(pid).awaitFirstOrNull()
            ?: throw IllegalArgumentException("No financial component for provided proposal Id!!!")
        return loadRelations(component, loadProtocol)
    }

    override suspend fun findAll(): Flow<ProposalFinancialComponent> {
        return proposalFinancialRepository.findAll().asFlow().map(this::loadRelations)
    }

    private suspend fun loadRelations(component: ProposalFinancialComponent, loadProtocol: Boolean = false): ProposalFinancialComponent {
        component.promoter = promoterRepository.findById(component.promoterId!!).awaitFirstOrNull()
        component.partnerships = partnershipRepository.findByFinanceComponentId(component.id!!)
        if(loadProtocol) {
            component.protocol = protocolService.findProtocolByProposalFinanceId(component.id!!)
        }
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