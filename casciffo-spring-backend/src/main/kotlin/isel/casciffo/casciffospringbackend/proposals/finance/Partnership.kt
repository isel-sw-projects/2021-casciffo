package isel.casciffo.casciffospringbackend.proposals.finance

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("partnerships")
data class Partnership (
     @Id
     @Column("partnership_id")
     var id: Int?,
     @Column("proposal_financial_id")
     var financeComponentId: Int,
     var iconUrl: String?,
     var siteUrl: String?,
     var representative: String?,
     var email: String,
     var phoneContact: String,
     var description: String?
)