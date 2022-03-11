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
     val financeComponentId: Int,
     val iconUrl: String,
     val siteUrl: String,
     val spokesmanName: String,
     val email: String,
     val phoneContact: String
)