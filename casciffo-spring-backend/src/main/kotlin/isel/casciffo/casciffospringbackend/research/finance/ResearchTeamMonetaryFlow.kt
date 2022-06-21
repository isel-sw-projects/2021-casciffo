package isel.casciffo.casciffospringbackend.research.finance

import isel.casciffo.casciffospringbackend.users.UserModel
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime
import java.util.Date

@Table("research_team_financial_scope")
data class ResearchTeamMonetaryFlow(
    @Id
    @Column("team_finance_id")
    var id: Int?,

    var investigatorId: Int?,

    @Column("trial_financial_component_id")
    var financialComponentId: Int?,

    @CreatedDate
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
