package isel.casciffo.casciffospringbackend.mappers.proposal

import isel.casciffo.casciffospringbackend.aggregates.proposal.ProposalAggregate
import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.data_management.Pathology
import isel.casciffo.casciffospringbackend.data_management.ServiceType
import isel.casciffo.casciffospringbackend.data_management.TherapeuticArea
import isel.casciffo.casciffospringbackend.proposals.finance.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.proposals.finance.promoter.Promoter
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProposalProtocol
import isel.casciffo.casciffospringbackend.proposals.proposal.ProposalModel
import isel.casciffo.casciffospringbackend.states.state.State
import isel.casciffo.casciffospringbackend.users.user.UserModel
import org.springframework.stereotype.Component

@Component
class ProposalAggregateMapper: Mapper<ProposalModel, ProposalAggregate> {
    override suspend fun mapDTOtoModel(dto: ProposalAggregate?): ProposalModel {
        if (dto == null) return ProposalModel()
        return ProposalModel(
            id = dto.proposalId,
            sigla = dto.sigla,
            type = dto.proposalType,
            createdDate = dto.createdDate,
            lastModified = dto.lastModified,
            stateId = dto.stateId,
            serviceTypeId = dto.serviceId,
            therapeuticAreaId = dto.therapeuticAreaId,
            pathologyId = dto.pathologyId,
            principalInvestigatorId = dto.piId,
            researchId = dto.researchId,
            state = State(id = dto.stateId, name = dto.stateName),
            serviceType = ServiceType(id = dto.serviceId, name = dto.serviceName),
            pathology = Pathology(id = dto.pathologyId, name = dto.pathologyName),
            therapeuticArea = TherapeuticArea(id = dto.therapeuticAreaId, dto.therapeuticAreaName),
            principalInvestigator = UserModel(userId = dto.piId, name = dto.piName, email = dto.piEmail),
            financialComponent = mapPFC(dto)
        )
    }

    private fun mapPFC(dto: ProposalAggregate): ProposalFinancialComponent? {
        return if(dto.pfcId == null) null
        else ProposalFinancialComponent(
                id = dto.pfcId,
                proposalId = dto.proposalId,
                promoterId = dto.promoterId,
                financialContractId = dto.financialContractId,
                hasPartnerships = dto.hasPartnerships,
                promoter = Promoter(id = dto.promoterId, name = dto.promoterName, email= dto.promoterEmail),
                protocol = ProposalProtocol(
                    id = dto.protocolId, validated = dto.validated,
                    validatedDate = dto.validatedDate, financialComponentId = dto.pfcId,
                    commentRef = dto.commentRef
                ),
                financialContract = FileInfo(
                    id = dto.financialContractId,
                    fileName = dto.fileName,
                    fileSize = dto.fileSize
                )
        )
    }

    override suspend fun mapModelToDTO(model: ProposalModel?): ProposalAggregate {
        throw NotImplementedError("This method is purposely left blank")
    }
}