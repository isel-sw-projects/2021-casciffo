package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux
import java.time.LocalDate

@Table("protocol")
data class ProposalProtocol(
    @Id
    @Column("protocol_id")
    var id: Int? = null,
    var internalName: String = "Comissão de Ética para Investigação Clínica",
    var externalName: String = "INFARMED, I.P",
    var internalDateValidated: LocalDate?=null,
    var externalDateValidated: LocalDate?=null,
    var externalValidated: Boolean = false,
    var internalValidated: Boolean = false,
    @Column("pfc_id")
    var financialComponentId: Int?=null,

    @Transient
    @Value("null")
    var comments: Flux<ProtocolComments>? = null
)
