package isel.casciffo.casciffospringbackend.aggregates.proposal

import isel.casciffo.casciffospringbackend.Mapper
import isel.casciffo.casciffospringbackend.promoter.Promoter
import isel.casciffo.casciffospringbackend.proposals.ProposalModel
import isel.casciffo.casciffospringbackend.proposals.constants.Pathology
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceType
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticArea
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.states.State
import isel.casciffo.casciffospringbackend.users.UserModel
import org.springframework.stereotype.Component

@Component
class ProposalAggregateMapper: Mapper<ProposalModel, ProposalAggregate> {
    override suspend fun mapDTOtoModel(dto: ProposalAggregate?): ProposalModel {
        if (dto == null) return ProposalModel()
        return ProposalModel(
            id = dto.proposalId,
            sigla = dto.sigla,
            type = dto.proposalType,
            dateCreated = dto.dateCreated,
            lastUpdated = dto.lastUpdated,
            stateId = dto.stateId,
            serviceTypeId = dto.serviceId,
            therapeuticAreaId = dto.therapeuticAreaId,
            pathologyId = dto.pathologyId,
            principalInvestigatorId = dto.piId,
            state = State(id = dto.stateId, name = dto.stateName),
            serviceType = ServiceType(id = dto.serviceId, name = dto.serviceName),
            pathology = Pathology(id = dto.pathologyId, name = dto.pathologyName),
            therapeuticArea = TherapeuticArea(id = dto.therapeuticAreaId, dto.therapeuticAreaName),
            principalInvestigator = UserModel(userId = dto.piId, name = dto.piName, email = dto.piEmail),
            financialComponent = mapPFC(dto)
        )
    }

    private fun mapPFC(dto: ProposalAggregate): ProposalFinancialComponent {
        return ProposalFinancialComponent(
            id = dto.pfcId,
            proposalId = dto.proposalId,
            promoterId = dto.promoterId,
            financialContractId = dto.financialContractId,
            promoter = Promoter(id = dto.promoterId, name = dto.promoterName, email= dto.promoterEmail)
        )
    }

    override suspend fun mapModelToDTO(model: ProposalModel?): ProposalAggregate {
        throw NotImplementedError("This method is purposely left blank")
    }
}