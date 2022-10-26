package isel.casciffo.casciffospringbackend.mappers.research_finance

import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.finance.overview.ResearchFinance
import isel.casciffo.casciffospringbackend.research.finance.overview.ResearchFinanceDTO
import kotlinx.coroutines.flow.asFlow
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Component
import reactor.kotlin.core.publisher.toFlux

@Component
class ResesearchFinanceMapper: Mapper<ResearchFinance, ResearchFinanceDTO> {
    override suspend fun mapDTOtoModel(dto: ResearchFinanceDTO?): ResearchFinance {
        return if (dto === null) ResearchFinance()
        else ResearchFinance(
            id = dto.id,
            researchId = dto.researchId,
            valuePerParticipant = dto.valuePerParticipant,
            roleValuePerParticipant = dto.roleValuePerParticipant,
            balance = dto.balance,
            monetaryFlow = dto.monetaryFlow?.asFlow(),
            teamFinanceFlow = dto.teamFinanceFlow?.asFlow()
        )
    }

    override suspend fun mapModelToDTO(model: ResearchFinance?): ResearchFinanceDTO {
        return if (model === null) ResearchFinanceDTO()
        else ResearchFinanceDTO(
            id = model.id,
            researchId = model.researchId,
            valuePerParticipant = model.valuePerParticipant,
            roleValuePerParticipant = model.roleValuePerParticipant,
            balance = model.balance,
            monetaryFlow = model.monetaryFlow?.toList(),
            teamFinanceFlow = model.teamFinanceFlow?.toList()
        )
    }

}