package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.proposals.comments.ProtocolComments
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux
import java.time.LocalDateTime

@Table("protocol")
data class ProposalProtocol(
    @Id
    @Column("protocol_id")
    var id: Int? = null,
    var internalName: String?= null,
    var externalName: String?= null,
    var internalDateValidated: LocalDateTime?=null,
    var externalDateValidated: LocalDateTime?=null,
    var externalValidated: Boolean?=false,
    var internalValidated: Boolean?=false,
    var financialComponentId: Int?=null,

    @Transient
    @Value("null")
    var comments: Flux<ProtocolComments>? = null
)
