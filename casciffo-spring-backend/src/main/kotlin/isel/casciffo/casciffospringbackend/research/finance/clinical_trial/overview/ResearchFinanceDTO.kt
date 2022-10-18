package isel.casciffo.casciffospringbackend.research.finance.clinical_trial.overview

import isel.casciffo.casciffospringbackend.research.finance.clinical_trial.monetary_flow.ResearchMonetaryFlow
import isel.casciffo.casciffospringbackend.research.finance.team.ResearchTeamMonetaryFlow


data class ResearchFinanceDTO(
    var id: Int? = null,
    var researchId: Int? = null,
    var valuePerParticipant: Int? = null,
    var roleValuePerParticipant: Int? = null,
    var balance: Float? = null,
    var monetaryFlow: List<ResearchMonetaryFlow>? = null,
    var teamFinanceFlow: List<ResearchTeamMonetaryFlow>? = null
)
