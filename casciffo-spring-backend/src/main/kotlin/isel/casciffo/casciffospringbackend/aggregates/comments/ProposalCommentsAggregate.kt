package isel.casciffo.casciffospringbackend.aggregates.comments

import isel.casciffo.casciffospringbackend.proposals.comments.CommentType
import isel.casciffo.casciffospringbackend.users.UserModel
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import java.time.LocalDateTime


data class ProposalCommentsAggregate (
    @Id
    var id: Int?=null,

    var proposalId: Int?=null,
    var authorId: Int?=null,
    var dateCreated: LocalDateTime? =null,
    var dateModified: LocalDateTime?=null,
    var content: String?=null,
    var commentType: CommentType?=null,
    @Column("user_name")
    var authorName: String?=null,
    @Column("user_email")
    var authorEmail: String?=null
)