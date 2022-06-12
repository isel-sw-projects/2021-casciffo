package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_PROTOCOL_COMMENTS_URL
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class ProtocolCommentsController(
    @Autowired val service: ProtocolCommentsService
) {
    @PostMapping(PROPOSAL_PROTOCOL_COMMENTS_URL)
    suspend fun createComment(
        @PathVariable proposalId: Int,
        @PathVariable pfcId: Int,
        @RequestBody comments: ProtocolComments
    ): ProtocolComments {
        comments.protocolId = proposalId
        return service.saveComment(comments)
    }
}