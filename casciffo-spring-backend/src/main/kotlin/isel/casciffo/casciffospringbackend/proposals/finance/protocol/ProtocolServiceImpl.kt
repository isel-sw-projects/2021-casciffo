package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.exceptions.InvalidProtocolId
import isel.casciffo.casciffospringbackend.exceptions.ResourceNotFoundException
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.comments.ProtocolCommentsRepository
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class ProtocolServiceImpl(
    @Autowired val proposalProtocolRepository: ProposalProtocolRepository,
    @Autowired val protocolCommentsRepository: ProtocolCommentsRepository
): ProtocolService {
    override suspend fun findProtocolByProposalFinanceId(proposalId: Int, financeId: Int): ProposalProtocol {
        return proposalProtocolRepository
            .findByFinancialComponentId(financeId)
            .awaitSingleOrNull()
            ?.let {
                loadComments(it)
            } ?: throw ResourceNotFoundException("No protocol found for proposalId:$proposalId")

    }

    private fun loadComments(protocol: ProposalProtocol): ProposalProtocol {
        //comments will be subscribed to, by being used, during mapping in the controller
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
        if(protocol.isValidated && protocol.validatedDate === null) {
            protocol.validatedDate = LocalDateTime.now()
        }
        return proposalProtocolRepository.save(protocol).awaitSingle()
    }
}