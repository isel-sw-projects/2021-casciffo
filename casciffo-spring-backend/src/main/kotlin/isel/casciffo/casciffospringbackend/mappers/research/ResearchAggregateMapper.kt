package isel.casciffo.casciffospringbackend.mappers.research

import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregate
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.proposals.constants.Pathology
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceType
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticArea
import isel.casciffo.casciffospringbackend.proposals.proposal.ProposalModel
import isel.casciffo.casciffospringbackend.research.research.ResearchModel
import isel.casciffo.casciffospringbackend.states.state.State
import isel.casciffo.casciffospringbackend.users.user.UserModel
import org.springframework.stereotype.Component

@Component
class ResearchAggregateMapper: Mapper<ResearchModel, ResearchAggregate> {
    override suspend fun mapDTOtoModel(dto: ResearchAggregate?): ResearchModel {
        return if(dto == null) ResearchModel()
        else ResearchModel(
            id = dto.id,
            lastModified = dto.lastModified,
            proposalId = dto.proposalId,
            stateId = dto.stateId,
            eudra_ct = dto.eudra_ct,
            sampleSize = dto.sampleSize,
            duration = dto.duration,
            cro = dto.cro,
            startDate = dto.startDate,
            endDate = dto.endDate,
            estimatedEndDate = dto.estimatedEndDate,
            estimatedPatientPool = dto.estimatedPatientPool,
            industry = dto.industry,
            protocol = dto.protocol,
            initiativeBy = dto.initiativeBy,
            phase = dto.phase,
            type = dto.type,
            treatmentType = dto.treatmentType,
            typology = dto.typology,
            specification = dto.specification,
            treatmentBranches = dto.treatmentBranches,
            canceledReason = dto.canceledReason,
            canceledById = dto.canceledById,
            state = State(id=dto.stateId, name = dto.stateName),
            proposal = mapSimpleProposal(dto),
            canceledBy = if(dto.canceledById !== null)
                UserModel(userId = dto.canceledById, name = dto.canceledByUserName, email = dto.canceledByUserEmail)
                else null,
            patients = null, //left null on purpose
            dossiers = null, //left null on purpose
            scientificActivities = null, //left null on purpose
            stateTransitions = null //left null on purpose
        )
    }

    fun mapSimpleProposal(dto: ResearchAggregate): ProposalModel {
        return ProposalModel(
            id = dto.proposalId,
            sigla = dto.sigla,
            pathology = Pathology(id=dto.pathologyId, name=dto.pathologyName),
            therapeuticArea = TherapeuticArea(id=dto.therapeuticAreaId, name=dto.therapeuticAreaName),
            serviceType = ServiceType(id=dto.serviceId, name=dto.serviceName),
            principalInvestigator = UserModel(userId = dto.principalInvestigatorId, name = dto.principalInvestigatorName)
        )
    }

    override suspend fun mapModelToDTO(model: ResearchModel?): ResearchAggregate {
        throw NotImplementedError("Left blank on purpose.")
    }
}