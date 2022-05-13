package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponent
import kotlinx.coroutines.reactor.awaitSingle
import reactor.core.publisher.Flux
import reactor.kotlin.core.publisher.toFlux

@Suppress("ReactiveStreamsUnusedPublisher") //values are used in service
class ProposalMapper {

    private fun mapDTONonListPropertiesToModel(proposalDTO: ProposalDTO, proposalModel: ProposalModel) {
        proposalModel.id = proposalDTO.id
        proposalModel.sigla = proposalDTO.sigla
        proposalModel.type = proposalDTO.type
        proposalModel.pathologyId = proposalDTO.pathologyId
        proposalModel.serviceTypeId = proposalDTO.serviceTypeId
        proposalModel.therapeuticAreaId = proposalDTO.therapeuticAreaId
        proposalModel.stateId = proposalDTO.stateId
        proposalModel.principalInvestigatorId = proposalDTO.principalInvestigatorId
        proposalModel.state = proposalDTO.state
        proposalModel.pathology = proposalDTO.pathology
        proposalModel.serviceType = proposalDTO.serviceType
        proposalModel.therapeuticArea = proposalDTO.therapeuticArea
        proposalModel.financialComponent = proposalDTO.financialComponent
    }
    private fun mapDTOListPropertiesToModel(proposalDTO: ProposalDTO, proposalModel: ProposalModel)  {
        proposalModel.investigationTeam = proposalDTO.investigationTeam?.toFlux()
        proposalModel.stateTransitions = proposalDTO.stateTransitions?.toFlux()
        proposalModel.timelineEvents = proposalDTO.timelineEvents?.toFlux()
        proposalModel.comments = proposalDTO.comments?.toFlux()

        //todo revisit when theres financialcomponentDTO with partnership list instead of flux...
        // proposalModel.financialComponent!!.partnerships = proposalDTO.financialComponentDTO!!.partnerships!!.toFlux()
    }
    private fun mapModelNonListPropertiesToDTO(proposalModel: ProposalModel, proposalDTO: ProposalDTO) {
        proposalDTO.id = proposalModel.id
        proposalDTO.sigla = proposalModel.sigla
        proposalDTO.type = proposalModel.type
        proposalDTO.pathologyId = proposalModel.pathologyId
        proposalDTO.serviceTypeId = proposalModel.serviceTypeId
        proposalDTO.therapeuticAreaId = proposalModel.therapeuticAreaId
        proposalDTO.stateId = proposalModel.stateId
        proposalDTO.principalInvestigatorId = proposalModel.principalInvestigatorId
        proposalDTO.state = proposalModel.state
        proposalDTO.pathology = proposalModel.pathology
        proposalDTO.serviceType = proposalModel.serviceType
        proposalDTO.therapeuticArea = proposalModel.therapeuticArea
        proposalDTO.financialComponent = proposalModel.financialComponent
    }
    private suspend fun mapModelListPropertiesToDTO(proposalModel: ProposalModel, proposalDTO: ProposalDTO) {
        proposalDTO.investigationTeam = proposalModel.investigationTeam?.collectList()?.awaitSingle()
        proposalDTO.stateTransitions = proposalModel.stateTransitions?.collectList()?.awaitSingle()
        proposalDTO.timelineEvents = proposalModel.timelineEvents?.collectList()?.awaitSingle()
        proposalDTO.comments = proposalModel.comments?.collectList()?.awaitSingle()
    }

    fun proposalDTOtoProposalModel(proposalDTO: ProposalDTO): ProposalModel {
        val proposalModel = ProposalModel()
        mapDTONonListPropertiesToModel(proposalDTO, proposalModel)
        mapDTOListPropertiesToModel(proposalDTO, proposalModel)
        return proposalModel
    }

    suspend fun proposalModelToProposalDTO(proposalModel: ProposalModel): ProposalDTO {
        val proposalDTO = ProposalDTO()
        mapModelNonListPropertiesToDTO(proposalModel, proposalDTO)
        mapModelListPropertiesToDTO(proposalModel, proposalDTO)
        return proposalDTO
    }

    // USE IF NEEDED
//    fun patch(proposalDTO: ProposalDTO, proposalModel: ProposalModel): ProposalModel {
//        if(pro)
//    }
}