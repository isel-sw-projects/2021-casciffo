package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux
import java.time.LocalDateTime
import java.util.Date

@Table("protocol")
data class ProposalProtocol(
    @Id
    @Column("protocol_id")
    var id: Int? = null,
    var validatedDate: LocalDateTime? = null,
    var isValidated: Boolean = false,
    @Column("pfc_id")
    var financialComponentId: Int?=null,

    @Transient
    @Value("null")
    var comments: Flux<ProtocolComments>? = null
)
