package isel.casciffo.casciffospringbackend.aggregates.comments

import isel.casciffo.casciffospringbackend.common.CommentType
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import java.time.LocalDateTime


data class ProposalCommentsAggregate (
    @Id
    @Column("comment_id")
    var id: Int?=null,

    var proposalId: Int?=null,
    var authorId: Int?=null,
    var createdDate: LocalDateTime? =null,
    var LastModified: LocalDateTime?=null,
    var content: String?=null,
    var commentType: CommentType?=null,
    @Column("user_name")
    var authorName: String?=null,
    @Column("user_email")
    var authorEmail: String?=null
)