package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.promoter.Promoter
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table(value = "proposal_financial_id")
data class ProposalFinancialComponent (
    @Id
    @Column(value = "proposal_financial_id")
    var id : Int?,

    val proposalId: Int,
    val promoterId: Int,
    val financialContractId: Int?,

    @Transient
    var promoter: Promoter?,

    @Transient
    var partnerships: List<Partnership>?
)