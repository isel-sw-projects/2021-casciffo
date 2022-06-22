package isel.casciffo.casciffospringbackend.proposals.comments

import isel.casciffo.casciffospringbackend.users.UserDTO
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.Date

data class ProposalCommentsDTO (
    var id: Int?=null,
    var proposalId: Int?=null,
    var authorId: Int?=null,
    val dateCreated: LocalDateTime?=null,
    val dateModified: LocalDateTime?=null,
    val content: String?=null,
    val commentType: CommentType?=null,
    var author: UserDTO?=null
)