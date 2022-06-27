package isel.casciffo.casciffospringbackend.mappers

import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamDTO
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamModel
import isel.casciffo.casciffospringbackend.proposals.ProposalDTO
import isel.casciffo.casciffospringbackend.proposals.ProposalModel
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComments
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsDTO
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponentDTO
import isel.casciffo.casciffospringbackend.users.UserDTO
import isel.casciffo.casciffospringbackend.users.UserModel
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import reactor.kotlin.core.publisher.toFlux

@Suppress("ReactiveStreamsUnusedPublisher") //values are used in service
@Component
class ProposalMapper(
    @Autowired private val userMapper: Mapper<UserModel, UserDTO>,
    @Autowired private val invTeamMapper: Mapper<InvestigationTeamModel, InvestigationTeamDTO>,
    @Autowired private val pfcMapper: Mapper<ProposalFinancialComponent, ProposalFinancialComponentDTO>,
    @Autowired private val commentsMapper: Mapper<ProposalComments, ProposalCommentsDTO>,
) : Mapper<ProposalModel, ProposalDTO> {

    override suspend fun mapDTOtoModel(dto: ProposalDTO?): ProposalModel {
        return if(dto === null) return ProposalModel()
        else ProposalModel(
            id = dto.id,
            createdDate = dto.createdDate,
            lastModified = dto.lastModified,
            sigla = dto.sigla,
            type = dto.type,
            pathologyId = dto.pathologyId,
            pathology = dto.pathology,
            serviceTypeId = dto.serviceTypeId,
            serviceType = dto.serviceType,
            therapeuticAreaId = dto.therapeuticAreaId,
            therapeuticArea = dto.therapeuticArea,
            stateId = dto.stateId,
            state = dto.state,
            principalInvestigatorId = dto.principalInvestigatorId,
            principalInvestigator = userMapper.mapDTOtoModel(dto.principalInvestigator),
            financialComponent = pfcModelOrNull(dto.financialComponent),
            comments = dto.comments?.map{commentsMapper.mapDTOtoModel(it)}?.toFlux(),
            investigationTeam = dto.investigationTeam?.map{invTeamMapper.mapDTOtoModel(it)}?.toFlux(),
            stateTransitions = dto.stateTransitions?.toFlux(),
            timelineEvents = dto.timelineEvents?.toFlux()
        )
    }

    private suspend fun pfcModelOrNull(financialComponent: ProposalFinancialComponentDTO?): ProposalFinancialComponent? {
        return if(financialComponent == null) null
        else pfcMapper.mapDTOtoModel(financialComponent)
    }

    private suspend fun pfcDTOorNull(financialComponent: ProposalFinancialComponent?): ProposalFinancialComponentDTO? {
        return if(financialComponent == null) null
        else pfcMapper.mapModelToDTO(financialComponent)
    }

    override suspend fun mapModelToDTO(model: ProposalModel?): ProposalDTO {
        return if(model === null) return ProposalDTO()
        else ProposalDTO(
            id = model.id,
            createdDate = model.createdDate,
            lastModified = model.lastModified,
            sigla = model.sigla,
            type = model.type,
            pathologyId = model.pathologyId,
            pathology = model.pathology,
            serviceTypeId = model.serviceTypeId,
            serviceType = model.serviceType,
            therapeuticAreaId = model.therapeuticAreaId,
            therapeuticArea = model.therapeuticArea,
            stateId = model.stateId,
            state = model.state,
            principalInvestigatorId = model.principalInvestigatorId,
            principalInvestigator = userMapper.mapModelToDTO(model.principalInvestigator),
            financialComponent = pfcDTOorNull(model.financialComponent),
            comments = model.comments?.collectList()?.awaitSingleOrNull()?.map { commentsMapper.mapModelToDTO(it) },
            investigationTeam = model.investigationTeam?.collectList()?.awaitSingleOrNull()?.map { invTeamMapper.mapModelToDTO(it) },
            stateTransitions = model.stateTransitions?.collectList()?.awaitSingleOrNull(),
            timelineEvents = model.timelineEvents?.collectList()?.awaitSingleOrNull()
        )
    }
}