package isel.casciffo.casciffospringbackend.research.finance.clinical_trial

import isel.casciffo.casciffospringbackend.common.TypeOfMonetaryFlow
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("research_finance")
data class ResearchMonetaryFlow(
    @Id
    @Column("research_finance")
    var id: Int?,

    @Column("trial_financial_component_id")
    var researchFinancialComponentId: Int?,

    var transactionDate: LocalDateTime,

    var typeOfMonetaryFlow: TypeOfMonetaryFlow,

    var motive: String,

    var amount: Int
)
