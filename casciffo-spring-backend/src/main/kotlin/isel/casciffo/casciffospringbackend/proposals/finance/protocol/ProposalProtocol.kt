package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate

@Table("protocol")
data class ProposalProtocol(
    @Id
    @Column("protocol_id")
    var id: Int? = null,
    var validatedDate: LocalDate? = null,
    var validated: Boolean? = null,
    var commentRef: Int?=null,
    @Column("pfc_id")
    var financialComponentId: Int?=null
)
