package isel.casciffo.casciffospringbackend.research.finance.clinical_trial

import isel.casciffo.casciffospringbackend.research.finance.team.ResearchTeamMonetaryFlowRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ResearchFinanceServiceImpl(
    @Autowired val researchFinanceRepository: ResearchFinanceRepository,
    @Autowired val researchMonetaryFlowRepository: ResearchMonetaryFlowRepository,
    @Autowired val researchTeamMonetaryFlowRepository: ResearchTeamMonetaryFlowRepository
) : ResearchFinanceService