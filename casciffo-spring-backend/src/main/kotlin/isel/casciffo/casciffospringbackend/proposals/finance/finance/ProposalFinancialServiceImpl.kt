package isel.casciffo.casciffospringbackend.proposals.finance.finance

import isel.casciffo.casciffospringbackend.common.ValidationType
import isel.casciffo.casciffospringbackend.proposals.finance.partnership.PartnershipService
import isel.casciffo.casciffospringbackend.proposals.finance.promoter.PromoterRepository
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolService
import isel.casciffo.casciffospringbackend.validations.Validation
import isel.casciffo.casciffospringbackend.validations.ValidationComment
import isel.casciffo.casciffospringbackend.validations.ValidationsRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class ProposalFinancialServiceImpl(
    @Autowired val proposalFinancialRepository: ProposalFinancialRepository,
    @Autowired val promoterRepository: PromoterRepository,
    @Autowired val partnershipService: PartnershipService,
    @Autowired val protocolService: ProtocolService,
    @Autowired val validationsRepository: ValidationsRepository
) : ProposalFinancialService {

    @Transactional
    override suspend fun createProposalFinanceComponent(pfc: ProposalFinancialComponent): ProposalFinancialComponent {
        verifyAndCreatePromoter(pfc)

        val createdPfc = proposalFinancialRepository.save(pfc).awaitSingle()
        if(pfc.partnerships != null) {
            createPartnerships(pfc, createdPfc)
        }

        createValidations(pfc)

        pfc.protocol = protocolService.createProtocol(pfc.id!!)

        pfc.id = createdPfc.id
        return pfc
    }

    private suspend fun createValidations(pfc: ProposalFinancialComponent) {
        val validations = listOf(
            Validation(pfcId = pfc.id, validationType = ValidationType.FINANCE_DEP),
            Validation(pfcId = pfc.id, validationType = ValidationType.JURIDICAL_DEP)
        )

        pfc.validations = validationsRepository.saveAll(validations)
    }

    private fun createPartnerships(
        pfc: ProposalFinancialComponent,
        createdPfc: ProposalFinancialComponent
    ) {
        pfc.partnerships = partnershipService.saveAll(
            pfc.partnerships!!.map {
                it.financeComponentId = createdPfc.id!!
                it
            }
        )
    }

    private suspend fun verifyAndCreatePromoter(pfc: ProposalFinancialComponent) {
        if (pfc.proposalId == null) throw IllegalArgumentException("Proposal Id must not be null here!!!")
        if (pfc.promoter == null && pfc.promoterId == null) throw IllegalArgumentException("Promoter must not be null here!!!")
        val promoter = promoterRepository.findByEmail(pfc.promoter!!.email!!).awaitSingleOrNull()
        if (promoter == null) {
            pfc.promoter = promoterRepository.save(pfc.promoter!!).awaitSingle()
        } else {
            pfc.promoter = promoter
        }
        pfc.promoterId = pfc.promoter!!.id!!
    }

    override suspend fun findComponentByProposalId(pid: Int, loadProtocol: Boolean): ProposalFinancialComponent {
        val component = proposalFinancialRepository.findByProposalId(pid).awaitFirstOrNull()
            ?: throw IllegalArgumentException("No financial component for proposal Id:$pid!!!")
        return loadRelations(component, loadProtocol)
    }

    override suspend fun findAll(): Flow<ProposalFinancialComponent> {
        return proposalFinancialRepository.findAll().asFlow().map(this::loadRelations)
    }

    override suspend fun isValidated(pfcId: Int): Boolean {
        return validationsRepository.isPfcValidated(pfcId).awaitSingle()
    }

    override suspend fun validate(pfcId: Int, validationComment: ValidationComment): ValidationComment {
        if(!validationComment.newValidation!!) return validationComment
        //todo check if validation id will be sent or not
        val validation = validationsRepository.findByPfcIdAndValidationType(pfcId, validationComment.validation!!.validationType!!).awaitSingle()
        validation.validated = true
        validation.validationDate = LocalDateTime.now()
        validation.commentRef = validationComment.comment!!.id
        validationComment.validation = validationsRepository.save(validation).awaitSingle()
        return validationComment
    }

    private suspend fun loadRelations(pfc: ProposalFinancialComponent, loadProtocol: Boolean = false): ProposalFinancialComponent {
        pfc.promoter = promoterRepository.findById(pfc.promoterId!!).awaitSingleOrNull()
        pfc.partnerships = partnershipService.findAllByProposalFinancialComponentId(pfc.id!!)
        pfc.validations = validationsRepository.findAllByPfcId(pfc.id!!)
        if(loadProtocol) {
            pfc.protocol = protocolService.getProtocolDetails(pfc.proposalId!!,pfc.id!!).protocol
        }
        return pfc
    }
}