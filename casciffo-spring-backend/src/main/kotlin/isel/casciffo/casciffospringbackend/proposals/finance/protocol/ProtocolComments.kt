package isel.casciffo.casciffospringbackend.proposals.comments

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("protocol_comments")
data class ProtocolComments (
    @Id
    var id: Int? = null,
    var protocolId: Int? = null,
    var observation: String? = null,
    var authorName: String? = null,
    var orgName: String? = null,
    var validated: Boolean? = false
)