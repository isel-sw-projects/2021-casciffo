package isel.casciffo.casciffospringbackend.proposals.finance

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("partnerships")
data class Partnership (
     @Id
     @Column("partnership_id")
     var id: Int? = null,
     var name: String? = null,
     @Column("proposal_financial_id")
     var financeComponentId: Int? = null,
     var iconUrl: String? = null,
     var siteUrl: String? = null,
     var representative: String? = null,
     var email: String? = null,
     var phoneContact: String? = null,
     var description: String? = null
)