package isel.casciffo.casciffospringbackend.proposals

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table(value = "proposal_financial_id")
class ProposalFinancialComponent (
    @Id
    @Column(value = "proposal_financial_id")
    var id : Int?,

    val proposalId: Int,
    val promoterId: Int,
    val financialContractId: Int?,

    @Transient
    var promoter: Promoter?
) {
    override fun toString(): String {
        return "{id:${id},\tproposalId:${proposalId},\tpromoterId:${promoterId}," +
                "\tcontractId:${financialContractId},\tpromoter:${promoter}}"
    }
}