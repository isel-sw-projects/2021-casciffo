package isel.casciffo.casciffospringbackend.research.finance.team

import isel.casciffo.casciffospringbackend.common.TypeOfMonetaryFlow
import isel.casciffo.casciffospringbackend.users.user.UserModel
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("research_team_financial_scope")
data class ResearchTeamMonetaryFlow(
    @Id
    @Column("team_finance_id")
    var id: Int? = null,
    var investigatorId: Int? = null,
    @Column("trial_financial_component_id")
    var financialComponentId: Int? = null,
    var transactionDate: LocalDateTime? = null,
    var typeOfFlow: TypeOfMonetaryFlow? = null,
    var responsibleForPayment: String? = null,
    var amount: Float? = null,
    var partitionPercentage: Float? = null,
    var roleAmount: Float? = null,

    @Transient
    @Value("null")
    var investigator: UserModel? = null
)
