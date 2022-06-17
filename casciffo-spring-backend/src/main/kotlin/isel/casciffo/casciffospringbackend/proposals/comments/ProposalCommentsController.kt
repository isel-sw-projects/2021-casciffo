package isel.casciffo.casciffospringbackend.proposals.comments

import isel.casciffo.casciffospringbackend.config.IsUIC
import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_COMMENTS
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.web.bind.annotation.*

@RestController
class ProposalCommentsController(
    @Autowired val commentsService: ProposalCommentsService
) {
    @GetMapping(PROPOSAL_COMMENTS)
    suspend fun getAllCommentsByProposal
                (
        @PathVariable proposalId: Int,
        @RequestParam(defaultValue = "") t: String,
        @RequestParam(defaultValue = "20") n: Int,
        @RequestParam(defaultValue = "0") p: Int
    ):
            Flow<ProposalComments> {
        val page = PageRequest.of(p, n, Sort.by("dateCreated").descending())
        return if (t.isEmpty()) {
            return commentsService.getComments(proposalId = proposalId, page)
        } else
            commentsService.getCommentsByType(
                proposalId = proposalId,
                type = t,
                page = page
            )
    }

    @PostMapping(PROPOSAL_COMMENTS)
    @IsUIC
     suspend fun createComment(@PathVariable proposalId: Int, @RequestBody(required = true) comment: ProposalComments): ProposalComments {
         return commentsService.createComment(comment)
     }
}