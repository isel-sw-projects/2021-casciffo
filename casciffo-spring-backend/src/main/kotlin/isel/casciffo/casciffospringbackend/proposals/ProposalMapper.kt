package isel.casciffo.casciffospringbackend.proposals

import org.mapstruct.Mapper
import reactor.kotlin.core.publisher.toFlux

@Mapper(componentModel = "spring")
class ProposalMapper {

    fun proposalDTOtoProposalModel(proposalDTO: ProposalDTO): ProposalModel {
        val proposalModel = ProposalModel()
        proposalModel.id = proposalDTO.id
        proposalModel.sigla = proposalDTO.sigla
        proposalModel.type = proposalDTO.type
        proposalModel.pathologyId = proposalDTO.pathologyId
        proposalModel.serviceTypeId = proposalDTO.serviceTypeId
        proposalModel.therapeuticAreaId = proposalDTO.therapeuticAreaId
        proposalModel.stateId = proposalDTO.stateId
        proposalModel.state = proposalDTO.state
        proposalModel.pathology = proposalDTO.pathology
        proposalModel.serviceType = proposalDTO.serviceType
        proposalModel.therapeuticArea = proposalDTO.therapeuticArea
        proposalModel.investigationTeam = proposalDTO.investigationTeam!!.toFlux()
        return proposalModel
    }

    // USE IF NEEDED
//    fun patch(proposalDTO: ProposalDTO, proposalModel: ProposalModel): ProposalModel {
//        if(pro)
//    }
}