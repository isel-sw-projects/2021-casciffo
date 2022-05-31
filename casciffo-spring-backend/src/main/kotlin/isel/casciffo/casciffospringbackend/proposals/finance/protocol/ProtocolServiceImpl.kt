package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.exceptions.InvalidProtocolId
import isel.casciffo.casciffospringbackend.exceptions.ResourceNotFoundException
import isel.casciffo.casciffospringbackend.util.buildGetResearchUrl
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class ProtocolServiceImpl(
    @Autowired val proposalProtocolRepository: ProposalProtocolRepository,
    @Autowired val protocolCommentsRepository: ProtocolCommentsRepository
): ProtocolService {
    override suspend fun findProtocolByProposalFinanceId(financeId: Int): ProposalProtocol {
        return try {
            val protocol = proposalProtocolRepository.findByFinancialComponentId(financeId).awaitSingle()
            loadComments(protocol)
        } catch (e: NoSuchElementException) {
            throw ResourceNotFoundException()
        }
    }

    private fun loadComments(protocol: ProposalProtocol): ProposalProtocol {
        val comments = protocolCommentsRepository.findAllByProtocolId(protocol.id!!)
        protocol.comments = comments
        return protocol
    }

    override suspend fun createProtocol(pfcId: Int): ProposalProtocol {
        val protocol = ProposalProtocol(financialComponentId = pfcId)
        return proposalProtocolRepository.save(protocol).awaitSingle()
    }

    override suspend fun updateProtocol(protocol: ProposalProtocol): ProposalProtocol {
        proposalProtocolRepository.findById(protocol.id!!).awaitSingle() ?: throw InvalidProtocolId()
        if(protocol.externalValidated && protocol.externalDateValidated === null) {
            protocol.externalDateValidated = LocalDate.now()
        }
        if(protocol.internalValidated && protocol.internalDateValidated === null) {
            protocol.internalDateValidated = LocalDate.now()
        }
        return proposalProtocolRepository.save(protocol).awaitSingle()
    }
}