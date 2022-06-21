package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.util.Date

@Table("protocol_comments")
data class ProtocolComments (
    @Id
    var id: Int? = null,
    var protocolId: Int? = null,
    var observation: String? = null,
    var authorName: String? = null,
    var orgName: String? = null,
    var validated: Boolean = false,
    @CreatedDate
    var dateCreated: Date? = null
)