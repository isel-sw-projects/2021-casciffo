package isel.casciffo.casciffospringbackend.research.finance

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.util.Date

@Table("research_finance")
data class ResearchMonetaryFlow(
    @Id
    @Column("research_finance")
    var id: Int?,

    @Column("trial_financial_component_id")
    var researchFinancialComponentId: Int?,

    @CreatedDate
    var transactionDate: Date,

    var typeOfMonetaryFlow: TypeOfMonetaryFlow,

    var motive: String,

    var amount: Int
)
