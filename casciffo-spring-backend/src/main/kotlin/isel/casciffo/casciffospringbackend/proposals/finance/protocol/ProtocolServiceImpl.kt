package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.exceptions.InvalidProtocolId
import isel.casciffo.casciffospringbackend.exceptions.ResourceNotFoundException
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsService
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.comments.ProtocolCommentsRepository
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class ProtocolServiceImpl(
    @Autowired val proposalProtocolRepository: ProposalProtocolRepository,
): ProtocolService {
    override suspend fun findProtocolByProposalFinanceId(proposalId: Int, financeId: Int): ProposalProtocol {
        return proposalProtocolRepository
            .findByFinancialComponentId(financeId)
            .awaitSingleOrNull()
            ?: throw ResourceNotFoundException("No protocol found for proposalId:$proposalId")

    }

    override suspend fun createProtocol(pfcId: Int): ProposalProtocol {
        val protocol = ProposalProtocol(financialComponentId = pfcId)
        return proposalProtocolRepository.save(protocol).awaitSingle()
    }

    override suspend fun updateProtocol(protocol: ProposalProtocol): ProposalProtocol {
        proposalProtocolRepository.findById(protocol.id!!).awaitSingle() ?: throw InvalidProtocolId()
        if(protocol.isValidated == true && protocol.validatedDate == null) {
            protocol.validatedDate = LocalDateTime.now()
        }
        return proposalProtocolRepository.save(protocol).awaitSingle()
    }
}