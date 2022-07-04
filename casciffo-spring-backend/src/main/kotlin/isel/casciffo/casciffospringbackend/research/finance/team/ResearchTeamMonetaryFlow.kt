package isel.casciffo.casciffospringbackend.research.finance.team

import isel.casciffo.casciffospringbackend.common.TypeOfMonetaryFlow
import isel.casciffo.casciffospringbackend.users.user.UserModel
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("research_team_financial_scope")
data class ResearchTeamMonetaryFlow(
    @Id
    @Column("team_finance_id")
    var id: Int?,

    var investigatorId: Int?,

    @Column("trial_financial_component_id")
    var financialComponentId: Int?,

    val transactionDate: LocalDateTime,

    val typeOfFlow: TypeOfMonetaryFlow,

    val responsibleForPayment: String,

    val amount: Float,

    val partitionPercentage: Float,

    val roleAmount: Float,

    @Transient
    @Value("null")
    var investigator: UserModel?
)
