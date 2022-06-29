package isel.casciffo.casciffospringbackend.proposals.comments

import isel.casciffo.casciffospringbackend.common.CommentType
import isel.casciffo.casciffospringbackend.users.UserDTO
import java.time.LocalDateTime

data class ProposalCommentsDTO (
    var id: Int?=null,
    var proposalId: Int?=null,
    var authorId: Int?=null,
    val createdDate: LocalDateTime?=null,
    val lastModified: LocalDateTime?=null,
    val content: String?=null,
    val commentType: CommentType?=null,
    var author: UserDTO?=null
)