package isel.casciffo.casciffospringbackend.proposals.comments

import isel.casciffo.casciffospringbackend.common.CommentType
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
        @RequestParam(defaultValue = "ALL") t: CommentType,
        @RequestParam(defaultValue = "20") n: Int,
        @RequestParam(defaultValue = "0") p: Int
    ):
            Flow<ProposalComment> {
        val page = PageRequest.of(p, n, Sort.by("createdDate").descending())
        return if (t == CommentType.ALL) {
            commentsService.getComments(proposalId = proposalId, page)
        } else
            commentsService.getCommentsByType(
                proposalId = proposalId,
                type = t,
                page = page
            )
    }

    @PostMapping(PROPOSAL_COMMENTS)
     suspend fun createComment(@PathVariable proposalId: Int, @RequestBody(required = true) comment: ProposalComment): ProposalComment {
         return commentsService.createComment(comment)
     }
}