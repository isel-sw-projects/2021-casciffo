package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.promoter.PromoterRepository
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

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
            ?: throw IllegalArgumentException("No financial component for proposal Id:$pid!!!")
        return loadRelations(component, loadProtocol)
    }

    override suspend fun findAll(): Flow<ProposalFinancialComponent> {
        return proposalFinancialRepository.findAll().asFlow().map(this::loadRelations)
    }

    private suspend fun loadRelations(pfc: ProposalFinancialComponent, loadProtocol: Boolean = false): ProposalFinancialComponent {
        pfc.promoter = promoterRepository.findById(pfc.promoterId!!).awaitSingleOrNull()
        pfc.partnerships = partnershipRepository.findByFinanceComponentId(pfc.id!!)
        if(loadProtocol) {
            pfc.protocol = protocolService.findProtocolByProposalFinanceId(pfc.proposalId!!,pfc.id!!)
        }
        return pfc
    }
}