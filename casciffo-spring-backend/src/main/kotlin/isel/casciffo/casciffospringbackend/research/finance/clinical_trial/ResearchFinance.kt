package isel.casciffo.casciffospringbackend.research.finance.clinical_trial

import isel.casciffo.casciffospringbackend.research.finance.team.ResearchTeamMonetaryFlow
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux

@Table("trial_financial_component")
data class ResearchFinance(
    @Id
    @Column("financial_id")
    var id: Int?,

    var researchId: Int?,

    var valuePerParticipant: Int,

    var roleValuePerParticipant: Int,

    var balance: Float,

    @Transient
    @Value("null")
    var monetaryFlow: Flux<ResearchMonetaryFlow>?,

    @Transient
    @Value("null")
    var teamFinanceFlow: Flux<ResearchTeamMonetaryFlow>?
)
