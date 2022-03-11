package isel.casciffo.casciffospringbackend.comments

import isel.casciffo.casciffospringbackend.users.User
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table(value = "proposal_comments")
data class ProposalComments (
    @Id
    @Column(value = "comment_id")
    var id: Int?,

    val proposalId: Int,
    val authorId: Int,

    @CreatedDate
    val dateCreated: LocalDateTime,

    @LastModifiedDate
    val dateModified: LocalDateTime?,

    val content: String,

    val commentType: CommentType,

    @Transient
    var author: User?
)
