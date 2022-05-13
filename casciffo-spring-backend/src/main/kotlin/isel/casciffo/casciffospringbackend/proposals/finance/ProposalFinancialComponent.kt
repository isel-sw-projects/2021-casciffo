package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.promoter.Promoter
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import org.springframework.data.annotation.Transient

@Table(value = "proposal_financial_component")
data class ProposalFinancialComponent (
    @Id
    @Column(value = "proposal_financial_id")
    var id : Int? = null,

    var proposalId: Int? = null,
    var promoterId: Int? = null,
    var financialContractId: Int? = null,

    @Transient
    @Value("null")
    var promoter: Promoter? = null,

    @Transient
    @Value("null")
    var partnerships: List<Partnership>? = null
)