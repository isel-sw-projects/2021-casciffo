package isel.casciffo.casciffospringbackend.research.finance.overview

import isel.casciffo.casciffospringbackend.research.finance.research_monetary_flow.ResearchMonetaryFlow
import isel.casciffo.casciffospringbackend.research.finance.team_monetary_flow.ResearchTeamMonetaryFlow
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("research_financial_component")
data class ResearchFinance(
    @Id
    @Column("financial_id")
    var id: Int? = null,
    var researchId: Int? = null,
    var valuePerParticipant: Int? = null,
    var roleValuePerParticipant: Int? = null,
    var balance: Float? = null,

    @Transient
    @Value("null")
    var monetaryFlow: Flow<ResearchMonetaryFlow>? = null,

    @Transient
    @Value("null")
    var teamFinanceFlow: Flow<ResearchTeamMonetaryFlow>? = null
)
