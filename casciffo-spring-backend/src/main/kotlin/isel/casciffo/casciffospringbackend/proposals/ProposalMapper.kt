package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.Mapper
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProposalProtocol
import kotlinx.coroutines.reactor.awaitSingle
import reactor.kotlin.core.publisher.toFlux

@Suppress("ReactiveStreamsUnusedPublisher") //values are used in service
class ProposalMapper : Mapper<ProposalModel, ProposalDTO> {

    override suspend fun mapDTONonListPropertiesToModel(dto: ProposalDTO, model: ProposalModel) {
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
        model.principalInvestigator = dto.principalInvestigator
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
                externalName = model.financialComponent?.protocol?.externalName!!,
                externalDateValidated = model.financialComponent?.protocol?.externalDateValidated,
                externalValidated = model.financialComponent?.protocol?.externalValidated!!,
                internalName = model.financialComponent?.protocol?.internalName!!,
                internalDateValidated = model.financialComponent?.protocol?.internalDateValidated,
                internalValidated = model.financialComponent?.protocol?.internalValidated!!
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
        return if (dto.financialComponent!!.protocol == null)
            null
        else ProposalProtocol(
            id = dto.financialComponent?.protocol?.id,
            financialComponentId = dto.financialComponent?.protocol?.financialComponentId,
            comments = dto.financialComponent?.protocol?.comments?.toFlux(),
            externalName = dto.financialComponent?.protocol?.externalName!!,
            externalDateValidated = dto.financialComponent?.protocol?.externalDateValidated,
            externalValidated = dto.financialComponent?.protocol?.externalValidated!!,
            internalName = dto.financialComponent?.protocol?.internalName!!,
            internalDateValidated = dto.financialComponent?.protocol?.internalDateValidated,
            internalValidated = dto.financialComponent?.protocol?.internalValidated!!
        )
    }

    override suspend fun mapDTOListPropertiesToModel(dto: ProposalDTO, model: ProposalModel)  {
        model.investigationTeam = dto.investigationTeam?.toFlux()
        model.stateTransitions = dto.stateTransitions?.toFlux()
        model.timelineEvents = dto.timelineEvents?.toFlux()
        model.comments = dto.comments?.toFlux()

        //todo revisit when theres financialcomponentDTO with partnership list instead of flux...
        // proposalModel.financialComponent!!.partnerships = proposalDTO.financialComponentDTO!!.partnerships!!.toFlux()
    }
    override suspend fun mapModelNonListPropertiesToDTO(model: ProposalModel, dto: ProposalDTO) {
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
        dto.principalInvestigator = model.principalInvestigator
        //financial component mapping
        if(model.financialComponent != null)
            mapFinancialModelToDTO(dto, model)
    }

    override suspend fun mapModelListPropertiesToDTO(model: ProposalModel, dto: ProposalDTO) {
        dto.investigationTeam = model.investigationTeam?.collectList()?.awaitSingle()
        dto.stateTransitions = model.stateTransitions?.collectList()?.awaitSingle()
        dto.timelineEvents = model.timelineEvents?.collectList()?.awaitSingle()
        dto.comments = model.comments?.collectList()?.awaitSingle()
    }

    override suspend fun mapDTOtoModel(dto: ProposalDTO): ProposalModel {
        val proposalModel = ProposalModel()
        mapDTONonListPropertiesToModel(dto, proposalModel)
        mapDTOListPropertiesToModel(dto, proposalModel)
        return proposalModel
    }

    override suspend fun mapModelToDTO(model: ProposalModel): ProposalDTO {
        val proposalDTO = ProposalDTO()
        mapModelNonListPropertiesToDTO(model, proposalDTO)
        mapModelListPropertiesToDTO(model, proposalDTO)
        return proposalDTO
    }

    // USE IF NEEDED
//    fun patch(proposalDTO: ProposalDTO, proposalModel: ProposalModel): ProposalModel {
//        if(pro)
//    }
}