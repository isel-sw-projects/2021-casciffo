package isel.casciffo.casciffospringbackend.research.finance.overview

import isel.casciffo.casciffospringbackend.research.finance.research_monetary_flow.ResearchMonetaryFlow
import isel.casciffo.casciffospringbackend.research.finance.team_monetary_flow.ResearchTeamMonetaryFlow

data class ResearchFinanceWithEntryDTO(
    var id: Int? = null,
    var researchId: Int? = null,
    var valuePerParticipant: Int? = null,
    var roleValuePerParticipant: Int? = null,
    var balance: Float? = null,
    var newMonetaryEntry: ResearchMonetaryFlow? = null,
    var newTeamFinanceEnty: ResearchTeamMonetaryFlow? = null
)
