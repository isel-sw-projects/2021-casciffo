package isel.casciffo.casciffospringbackend.proposals.finance.finance

import isel.casciffo.casciffospringbackend.proposals.finance.partnership.Partnership
import isel.casciffo.casciffospringbackend.proposals.finance.promoter.Promoter
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProposalProtocol
import isel.casciffo.casciffospringbackend.validations.Validation
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux

@Table(value = "proposal_financial_component")
data class ProposalFinancialComponent (
    @Id
    @Column(value = "proposal_financial_id")
    var id : Int? = null,

    var proposalId: Int? = null,
    var promoterId: Int? = null,
    var financialContractId: Int? = null,

    var hasPartnerships: Boolean? = null,

    @Transient
    @Value("null")
    var promoter: Promoter? = null,

    @Transient
    @Value("null")
    var partnerships: Flux<Partnership>? = null,

    @Transient
    @Value("null")
    var protocol: ProposalProtocol? = null,

    @Transient
    @Value("null")
    var validations: Flux<Validation>? = null
)