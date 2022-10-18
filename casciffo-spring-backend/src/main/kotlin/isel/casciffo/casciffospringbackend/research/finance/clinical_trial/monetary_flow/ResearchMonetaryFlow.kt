package isel.casciffo.casciffospringbackend.research.finance.clinical_trial.monetary_flow

import isel.casciffo.casciffospringbackend.common.TypeOfMonetaryFlow
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("research_finance_row")
data class ResearchMonetaryFlow(
    @Id
    @Column("research_finance_id")
    var id: Int?,

    @Column("trial_financial_component_id")
    var researchFinancialComponentId: Int?,

    var transactionDate: LocalDateTime?,

    @Column("type_of_flow")
    var typeOfMonetaryFlow: TypeOfMonetaryFlow?,
    var motive: String?,
    var amount: Float?
)
