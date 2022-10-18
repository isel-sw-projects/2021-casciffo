package isel.casciffo.casciffospringbackend.mappers.research_finance

import isel.casciffo.casciffospringbackend.aggregates.research_finance.ResearchTeamFinanceEntryAggregate
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.finance.team.ResearchTeamMonetaryFlow
import isel.casciffo.casciffospringbackend.users.user.UserModel
import org.springframework.stereotype.Component

@Component
class ResearchTeamFinanceEntryMapper: Mapper<ResearchTeamMonetaryFlow, ResearchTeamFinanceEntryAggregate> {
    override suspend fun mapDTOtoModel(dto: ResearchTeamFinanceEntryAggregate?): ResearchTeamMonetaryFlow {
        return if(dto == null) return ResearchTeamMonetaryFlow()
        else ResearchTeamMonetaryFlow(
            id = dto.id,
            investigatorId = dto.investigatorId,
            financialComponentId = dto.financialComponentId,
            transactionDate = dto.transactionDate,
            typeOfFlow = dto.typeOfFlow,
            responsibleForPayment = dto.responsibleForPayment,
            amount = dto.amount,
            partitionPercentage = dto.partitionPercentage,
            roleAmount = dto.roleAmount,
            investigator = UserModel(
                userId = dto.investigatorId,
                name = dto.investigatorName,
                email = dto.investigatorEmail
            )
        )
    }

    override suspend fun mapModelToDTO(model: ResearchTeamMonetaryFlow?): ResearchTeamFinanceEntryAggregate {
        throw NotImplementedError("Left blank on purpose.")
    }

}