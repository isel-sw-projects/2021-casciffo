package isel.casciffo.casciffospringbackend.research.finance.overview

import isel.casciffo.casciffospringbackend.aggregates.research_finance.ResearchTeamFinanceEntryAggregate
import isel.casciffo.casciffospringbackend.aggregates.research_finance.ResearchTeamFinanceEntryAggregateRepo
import isel.casciffo.casciffospringbackend.common.TypeOfMonetaryFlow
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.finance.research_monetary_flow.ResearchMonetaryFlow
import isel.casciffo.casciffospringbackend.research.finance.research_monetary_flow.ResearchMonetaryFlowRepository
import isel.casciffo.casciffospringbackend.research.finance.team_monetary_flow.ResearchTeamMonetaryFlow
import isel.casciffo.casciffospringbackend.research.finance.team_monetary_flow.ResearchTeamMonetaryFlowRepository
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

        rf.monetaryFlow = researchMonetaryFlowRepository.findByRfcId(rf.id!!).asFlow()
        rf.teamFinanceFlow = researchTeamMonetaryFlowAggregate
            .findAllByFinancialComponentId(rf.id!!)
            .asFlow()
            .map(teamMapper::mapDTOtoModel)

        return rf
    }

    override suspend fun updateFinanceComponent(researchId: Int, researchFinance: ResearchFinance, isValidated: Boolean): ResearchFinance {
        if(!isValidated) validateResearchId(researchId)

        return researchFinanceRepository.save(researchFinance).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save object $researchFinance.")
    }

    override suspend fun saveMonetaryTeamFlowEntry(
        researchId: Int,
        entry: ResearchTeamMonetaryFlow
    ): ResearchTeamMonetaryFlow {
        //TODO REVER COMO ESTE PROCESSO ACONTECE
        validateAndUpdateRFC(researchId, entry.amount!!, entry.typeOfMonetaryFlow!!)

        return researchTeamMonetaryFlowRepository.save(entry).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save object $entry")
    }

    private suspend fun validateAndUpdateRFC(
        researchId: Int,
        balanceChange: Float,
        typeOfMonetaryFlow: TypeOfMonetaryFlow
    ) {
        val rfc = validateResearchId(researchId)
        rfc.balance =
            if (typeOfMonetaryFlow === TypeOfMonetaryFlow.ENTRADA) rfc.balance!!.plus(balanceChange)
            else rfc.balance!!.minus(balanceChange)
        if(rfc.balance!! < 0) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantidade irá levar o balanço a negativo!")
        }
        updateFinanceComponent(researchId, rfc, true)
    }

    override suspend fun saveMonetaryResearchFlowEntry(
        researchId: Int,
        entry: ResearchMonetaryFlow
    ): ResearchMonetaryFlow {
        validateAndUpdateRFC(researchId, entry.amount!!, entry.typeOfMonetaryFlow!!)

        return researchMonetaryFlowRepository.save(entry).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save object $entry")
    }

    suspend fun validateResearchId(researchId: Int): ResearchFinance {
        val rfc = researchFinanceRepository.findByResearchId(researchId).awaitSingleOrNull()
        val isValid = rfc !== null
        if(!isValid)
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "No financial component associated to research with id $researchId")
        return rfc!!
    }
}