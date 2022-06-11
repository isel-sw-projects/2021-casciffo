package isel.casciffo.casciffospringbackend.proposals.comments

import isel.casciffo.casciffospringbackend.users.UserModel
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table(value = "proposal_comments")
data class ProposalComments (
    @Id
    @Column(value = "comment_id")
    var id: Int?=null,

    var proposalId: Int?=null,
    var authorId: Int?=null,

    @CreatedDate
    val dateCreated: LocalDateTime?=null,

    @LastModifiedDate
    val dateModified: LocalDateTime?=null,

    val content: String,

    val commentType: CommentType,

    @Transient
    @Value("null")
    var author: UserModel?=null
)
