package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.util.PROPOSAL_PROTOCOL_COMMENTS_URL
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
class ProtocolCommentsController(
    @Autowired val service: ProtocolCommentsService
) {
    @PostMapping(PROPOSAL_PROTOCOL_COMMENTS_URL)
    suspend fun createComment(@PathVariable proposalId: Int, @RequestBody comments: ProtocolComments): ProtocolComments {
        comments.protocolId = proposalId
        return service.saveComment(comments)
    }
}