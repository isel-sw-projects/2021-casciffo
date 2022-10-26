package isel.casciffo.casciffospringbackend.research.finance.research_monetary_flow

import isel.casciffo.casciffospringbackend.common.TypeOfMonetaryFlow
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate
import java.time.LocalDateTime

@Table("research_finance_row")
data class ResearchMonetaryFlow(
    @Id
    @Column("research_finance_id")
    var id: Int? = null,

    @Column("trial_financial_component_id")
    var rfcId: Int? = null,

    var transactionDate: LocalDate? = null,

    @Column("type_of_flow")
    var typeOfMonetaryFlow: TypeOfMonetaryFlow? = null,
    var motive: String? = null,
    var amount: Float? = null
)
