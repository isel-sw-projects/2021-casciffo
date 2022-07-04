package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.common.CommentType
import isel.casciffo.casciffospringbackend.exceptions.ResourceNotFoundException
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsService
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class ProtocolServiceImpl(
    @Autowired val proposalProtocolRepository: ProposalProtocolRepository,
    @Autowired val commentService: ProposalCommentsService,
): ProtocolService {
    override suspend fun getProtocolDetails(
        proposalId: Int,
        financeId: Int,
        loadComments: Boolean
    ): ProtocolAndCommentsDTO {
        val protocol = proposalProtocolRepository
            .findByFinancialComponentId(financeId)
            .awaitSingleOrNull()
            ?: throw ResourceNotFoundException("No protocol found for proposalId:$proposalId")
        if(!loadComments) return ProtocolAndCommentsDTO(protocol, null)

        val page = PageRequest.of(0, 20, Sort.by("createdDate").descending())
        val comments = commentService.getCommentsByType(proposalId, CommentType.PROTOCOL, page).toList()
        return ProtocolAndCommentsDTO(protocol, comments)
    }

    override suspend fun createProtocol(pfcId: Int): ProposalProtocol {
        val protocol = ProposalProtocol(financialComponentId = pfcId)
        return proposalProtocolRepository.save(protocol).awaitSingle()
    }

    override suspend fun handleNewProtocolComment(proposalId: Int, pfcId: Int,aggregate: ProtocolAggregate): ProtocolAggregate {
        val protocol = getProtocolDetails(proposalId, pfcId).protocol!!
        protocol.financialComponentId = pfcId
        aggregate.comment!!.proposalId = proposalId
        val c = commentService.createComment(aggregate.comment)
        val updatedProtocol = updateProtocol(protocol, c.id, aggregate.newValidation)
        return ProtocolAggregate(updatedProtocol, c)
    }

    suspend fun updateProtocol(
        protocol: ProposalProtocol,
        cRef: Int?,
        newValidation: Boolean? = false
    ): ProposalProtocol {
         if(newValidation == null || !newValidation)
            return protocol

        protocol.commentRef = cRef
        protocol.validatedDate = LocalDate.now()
        return proposalProtocolRepository.save(protocol).awaitSingle()
    }
}