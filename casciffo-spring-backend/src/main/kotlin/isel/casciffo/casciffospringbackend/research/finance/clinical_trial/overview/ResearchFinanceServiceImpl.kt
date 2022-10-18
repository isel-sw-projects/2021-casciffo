package isel.casciffo.casciffospringbackend.research.finance.clinical_trial.overview

import isel.casciffo.casciffospringbackend.aggregates.research_finance.ResearchTeamFinanceEntryAggregate
import isel.casciffo.casciffospringbackend.aggregates.research_finance.ResearchTeamFinanceEntryAggregateRepo
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.finance.clinical_trial.monetary_flow.ResearchMonetaryFlow
import isel.casciffo.casciffospringbackend.research.finance.clinical_trial.monetary_flow.ResearchMonetaryFlowRepository
import isel.casciffo.casciffospringbackend.research.finance.team.ResearchTeamMonetaryFlow
import isel.casciffo.casciffospringbackend.research.finance.team.ResearchTeamMonetaryFlowRepository
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class ResearchFinanceServiceImpl(
    @Autowired val researchFinanceRepository: ResearchFinanceRepository,
    @Autowired val researchMonetaryFlowRepository: ResearchMonetaryFlowRepository,
    @Autowired val researchTeamMonetaryFlowRepository: ResearchTeamMonetaryFlowRepository,
    @Autowired val researchTeamMonetaryFlowAggregate: ResearchTeamFinanceEntryAggregateRepo,
    @Autowired val teamMapper: Mapper<ResearchTeamMonetaryFlow, ResearchTeamFinanceEntryAggregate>
) : ResearchFinanceService {

    override suspend fun createResearchFinance(researchId: Int): ResearchFinance {
        TODO("Not yet implemented")
    }
    override suspend fun getFinanceComponentByResearchId(researchId: Int): ResearchFinance {
        val rf = researchFinanceRepository.findByResearchId(researchId).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "No finance component for research with id $researchId.")

        rf.monetaryFlow = researchMonetaryFlowRepository.findByResearchFinancialComponentId(rf.id!!).asFlow()
        rf.teamFinanceFlow = researchTeamMonetaryFlowAggregate
            .findAllByFinancialComponentId(rf.id!!)
            .asFlow()
            .map(teamMapper::mapDTOtoModel)

        return rf
    }

    override suspend fun updateFinanceComponent(researchId: Int, researchFinance: ResearchFinance): ResearchFinance {
        validateResearchId(researchId)

        return researchFinanceRepository.save(researchFinance).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save object $researchFinance.")
    }

    override suspend fun saveMonetaryTeamFlowEntry(
        researchId: Int,
        entry: ResearchTeamMonetaryFlow
    ): ResearchFinance {
        validateAndUpdateRFC(researchId, entry.amount!!)

        researchTeamMonetaryFlowRepository.save(entry).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save object $entry")

        return getFinanceComponentByResearchId(researchId)
    }

    private suspend fun validateAndUpdateRFC(
        researchId: Int,
        balanceChange: Float
    ) {
        val rfc = validateResearchId(researchId)
        rfc.balance = rfc.balance!!.minus(balanceChange)
        if(rfc.balance!! < 0) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantidade irá levar o balanço a negativo!")
        }
        updateFinanceComponent(researchId, rfc)
    }

    override suspend fun saveMonetaryResearchFlowEntry(
        researchId: Int,
        entry: ResearchMonetaryFlow
    ): ResearchFinance {
        validateAndUpdateRFC(researchId, entry.amount!!)

        researchMonetaryFlowRepository.save(entry).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save object $entry")

        return getFinanceComponentByResearchId(researchId)
    }

    suspend fun validateResearchId(researchId: Int): ResearchFinance {
        val rfc = researchFinanceRepository.findByResearchId(researchId).awaitSingleOrNull()
        val isValid = rfc !== null
        if(!isValid)
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "No financial component associated to research with id $researchId")
        return rfc!!
    }
}