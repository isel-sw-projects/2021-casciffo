package isel.casciffo.casciffospringbackend.research.finance

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
    var monetaryFlow: Flux<ResearchMonetaryFlow>?,

    @Transient
    var teamFinanceFlow: Flux<ResearchTeamMonetaryFlow>?
)
