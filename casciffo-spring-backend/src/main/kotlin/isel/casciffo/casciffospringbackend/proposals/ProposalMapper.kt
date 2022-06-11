package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.Mapper
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamDTO
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamModel
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComments
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsDTO
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProposalProtocol
import isel.casciffo.casciffospringbackend.users.UserDTO
import isel.casciffo.casciffospringbackend.users.UserModel
import kotlinx.coroutines.reactive.awaitSingleOrNull
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import reactor.kotlin.core.publisher.toFlux

@Suppress("ReactiveStreamsUnusedPublisher") //values are used in service
@Component
class ProposalMapper(
    @Autowired private val userMapper: Mapper<UserModel, UserDTO>,
    @Autowired private val invTeamMapper: Mapper<InvestigationTeamModel, InvestigationTeamDTO>,
    @Autowired private val commentsMapper: Mapper<ProposalComments, ProposalCommentsDTO>,
) : Mapper<ProposalModel, ProposalDTO> {

    suspend fun mapDTONonListPropertiesToModel(dto: ProposalDTO, model: ProposalModel) {
        model.id = dto.id
        model.dateCreated = dto.dateCreated
        model.lastUpdated = dto.lastUpdated
        model.sigla = dto.sigla
        model.type = dto.type
        model.pathologyId = dto.pathologyId
        model.pathology = dto.pathology
        model.serviceTypeId = dto.serviceTypeId
        model.serviceType = dto.serviceType
        model.therapeuticAreaId = dto.therapeuticAreaId
        model.therapeuticArea = dto.therapeuticArea
        model.stateId = dto.stateId
        model.state = dto.state
        model.principalInvestigatorId = dto.principalInvestigatorId
        model.principalInvestigator = userMapper.mapDTOtoModel(dto.principalInvestigator)
        //financial component mapping
        if(dto.financialComponent != null)
            mapFinancialDTOToModel(model, dto)
    }

    private fun mapFinancialDTOToModel(
        model: ProposalModel,
        dto: ProposalDTO
    ) {
        model.financialComponent = ProposalFinancialComponent(
            id = dto.financialComponent!!.id,
            proposalId = dto.financialComponent!!.proposalId,
            promoterId = dto.financialComponent!!.promoterId,
            financialContractId = dto.financialComponent!!.financialContractId,
            promoter = dto.financialComponent!!.promoter,
            partnerships = dto.financialComponent!!.partnerships?.toFlux(),
            protocol = mapProtocolDTOToModel(model)
        )
    }


    suspend fun mapProtocolModelToDTO(
        model: ProposalModel
    ): ProtocolDTO? {
        return if (model.financialComponent!!.protocol == null)
            null
        else
            ProtocolDTO(
                id = model.financialComponent?.protocol?.id,
                financialComponentId = model.financialComponent?.protocol?.financialComponentId,
                comments = model.financialComponent?.protocol?.comments?.collectList()?.awaitSingle(),
                isValidated = model.financialComponent?.protocol?.isValidated!!,
                validatedDate = model.financialComponent?.protocol?.validatedDate
            )
    }

    private suspend fun mapFinancialModelToDTO(
        dto: ProposalDTO,
        model: ProposalModel
    ) {
        dto.financialComponent = ProposalFinancialComponentDTO(
            id = model.financialComponent!!.id,
            proposalId = model.financialComponent!!.proposalId,
            promoterId = model.financialComponent!!.promoterId,
            financialContractId = model.financialComponent!!.financialContractId,
            promoter = model.financialComponent!!.promoter,
            partnerships = model.financialComponent!!.partnerships?.collectList()?.awaitSingle(),
            protocol = mapProtocolModelToDTO(model)
        )
    }

    fun mapProtocolDTOToModel(
        dto: ProposalModel
    ): ProposalProtocol? {
        return if (dto.financialComponent?.protocol == null)
            null
        else ProposalProtocol(
            id = dto.financialComponent?.protocol?.id,
            financialComponentId = dto.financialComponent?.protocol?.financialComponentId,
            comments = dto.financialComponent?.protocol?.comments?.toFlux(),
            isValidated = dto.financialComponent?.protocol?.isValidated!!,
            validatedDate = dto.financialComponent?.protocol?.validatedDate
        )
    }

    suspend fun mapDTOListPropertiesToModel(dto: ProposalDTO, model: ProposalModel)  {
        model.investigationTeamModel = dto.investigationTeam?.map{invTeamMapper.mapDTOtoModel(it)}?.toFlux()
        model.stateTransitions = dto.stateTransitions?.toFlux()
        model.timelineEvents = dto.timelineEvents?.toFlux()
        model.comments = dto.comments?.map{commentsMapper.mapDTOtoModel(it)}?.toFlux()
    }
    suspend fun mapModelNonListPropertiesToDTO(model: ProposalModel, dto: ProposalDTO) {
        dto.id = model.id
        dto.dateCreated = model.dateCreated
        dto.lastUpdated = model.lastUpdated
        dto.sigla = model.sigla
        dto.type = model.type
        dto.pathologyId = model.pathologyId
        dto.pathology = model.pathology
        dto.serviceTypeId = model.serviceTypeId
        dto.serviceType = model.serviceType
        dto.therapeuticAreaId = model.therapeuticAreaId
        dto.therapeuticArea = model.therapeuticArea
        dto.stateId = model.stateId
        dto.state = model.state
        dto.principalInvestigatorId = model.principalInvestigatorId
        dto.principalInvestigator = userMapper.mapModelToDTO(model.principalInvestigator)
        //financial component mapping
        if(model.financialComponent != null)
            mapFinancialModelToDTO(dto, model)
    }

    suspend fun mapModelListPropertiesToDTO(model: ProposalModel, dto: ProposalDTO) {
        dto.investigationTeam = model.investigationTeamModel?.collectList()?.awaitSingleOrNull()?.map { invTeamMapper.mapModelToDTO(it) }
        dto.stateTransitions = model.stateTransitions?.collectList()?.awaitSingleOrNull()
        dto.timelineEvents = model.timelineEvents?.collectList()?.awaitSingleOrNull()
        dto.comments = model.comments?.collectList()?.awaitSingleOrNull()?.map { commentsMapper.mapModelToDTO(it) }
    }

    override suspend fun mapDTOtoModel(dto: ProposalDTO?): ProposalModel {
        if(dto === null) return ProposalModel()
        val proposalModel = ProposalModel()
        mapDTONonListPropertiesToModel(dto, proposalModel)
        mapDTOListPropertiesToModel(dto, proposalModel)
        return proposalModel
    }

    override suspend fun mapModelToDTO(model: ProposalModel?): ProposalDTO {
        if(model === null) return ProposalDTO()
        val proposalDTO = ProposalDTO()
        mapModelNonListPropertiesToDTO(model, proposalDTO)
        mapModelListPropertiesToDTO(model, proposalDTO)
        return proposalDTO
    }
}