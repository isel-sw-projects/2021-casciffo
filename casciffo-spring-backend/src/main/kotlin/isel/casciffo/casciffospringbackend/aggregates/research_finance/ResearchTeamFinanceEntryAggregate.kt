package isel.casciffo.casciffospringbackend.aggregates.research_finance

import isel.casciffo.casciffospringbackend.common.TypeOfMonetaryFlow
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import java.time.LocalDateTime

data class ResearchTeamFinanceEntryAggregate(
    @Id
    @Column("team_finance_id")
    var id: Int? = null,
    @Column("trial_financial_component_id")
    var financialComponentId: Int? = null,

    var transactionDate: LocalDateTime? = null,
    var typeOfFlow: TypeOfMonetaryFlow? = null,
    var responsibleForPayment: String? = null,
    var amount: Float? = null,
    var partitionPercentage: Float? = null,
    var roleAmount: Float? = null,

    //Investigator info
    var investigatorId: Int? = null,
    @Column("user_name")
    var investigatorName: String? = null,
    @Column("user_email")
    var investigatorEmail: String? = null,
)
