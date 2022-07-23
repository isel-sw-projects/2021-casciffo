package isel.casciffo.casciffospringbackend.proposals.comments

import isel.casciffo.casciffospringbackend.common.CommentType
import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_COMMENTS_DETAIL_URL
import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_COMMENTS_URL
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class ProposalCommentsController(
    @Autowired val commentsService: ProposalCommentsService
) {
    @GetMapping(PROPOSAL_COMMENTS_URL)
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

    @PostMapping(PROPOSAL_COMMENTS_URL)
     suspend fun createComment(
        @PathVariable proposalId: Int,
        @RequestBody comment: ProposalComment
    ): ProposalComment {
         return commentsService.createComment(comment)
     }

    @DeleteMapping(PROPOSAL_COMMENTS_DETAIL_URL)
    suspend fun deleteComment(
        @PathVariable proposalId: Int,
        @PathVariable cId: Int
    ): ResponseEntity<ProposalComment> {
        val deletedComment = commentsService.deleteComment(proposalId, cId)
        return ResponseEntity.ok(deletedComment)
    }
}