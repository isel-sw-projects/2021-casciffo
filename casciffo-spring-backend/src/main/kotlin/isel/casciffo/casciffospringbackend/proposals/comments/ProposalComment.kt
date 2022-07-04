package isel.casciffo.casciffospringbackend.proposals.comments

import isel.casciffo.casciffospringbackend.common.CommentType
import isel.casciffo.casciffospringbackend.users.user.UserModel
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table(value = "proposal_comments")
data class ProposalComment(
    @Id
    @Column(value = "comment_id")
    var id: Int?=null,

    var proposalId: Int?=null,
    var authorId: Int?=null,

    var createdDate: LocalDateTime? =null,

    var lastModified: LocalDateTime?=null,

    var content: String?=null,

    var commentType: CommentType?=null,

    @Transient
    @Value("null")
    var author: UserModel?=null
)
