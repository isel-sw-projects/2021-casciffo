package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.promoter.Promoter
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import org.springframework.data.annotation.Transient

@Table(value = "proposal_financial_component")
data class ProposalFinancialComponent (
    @Id
    @Column(value = "proposal_financial_id")
    var id : Int?,

    var proposalId: Int?,
    var promoterId: Int?,
    var financialContractId: Int?,

    @Transient
    var promoter: Promoter?,

    @Transient
    var partnerships: List<Partnership>?
)