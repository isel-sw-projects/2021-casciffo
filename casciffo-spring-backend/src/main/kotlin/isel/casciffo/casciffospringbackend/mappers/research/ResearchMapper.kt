package isel.casciffo.casciffospringbackend.mappers.research

import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamDTO
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamModel
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.research.ResearchDTO
import isel.casciffo.casciffospringbackend.research.research.ResearchModel
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitDTO
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitModel
import kotlinx.coroutines.flow.asFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class ResearchMapper(
    @Autowired private val invTeamMapper: Mapper<InvestigationTeamModel, InvestigationTeamDTO>,
    @Autowired private val visitsMapper: Mapper<VisitModel, VisitDTO>
): Mapper<ResearchModel, ResearchDTO> {

    override suspend fun mapDTOtoModel(dto: ResearchDTO?): ResearchModel {
        if(dto == null) return ResearchModel()
        return ResearchModel(
            id = dto.id,
            cro = dto.cro,
            duration = dto.duration,
            industry = dto.industry,
            type = dto.type,
            startDate = dto.startDate,
            endDate = dto.endDate,
            estimatedEndDate = dto.estimatedEndDate,
            estimatedPatientPool = dto.estimatedPatientPool,
            actualPatientPool = dto.actualPatientPool,
            initiativeBy = dto.initiativeBy,
            eudra_ct = dto.eudra_ct,
            phase = dto.phase,
            proposal = dto.proposal,
            proposalId = dto.proposalId,
            protocol = dto.protocol,
            sampleSize = dto.sampleSize,
            treatmentType = dto.treatmentType,
            typology = dto.typology,
            specification = dto.specification,
            state = dto.state,
            stateId = dto.stateId,
            visits = dto.visits?.map { visitsMapper.mapDTOtoModel(it) }?.asFlow(),
            patients = dto.patients?.asFlow(),
            stateTransitions = dto.stateTransitions?.asFlow(),
            dossiers = dto.dossiers?.asFlow(),
            scientificActivities = dto.scientificActivities?.asFlow(),
            investigationTeam = dto.investigationTeam?.asFlow()?.map(invTeamMapper::mapDTOtoModel)
        )
    }

    override suspend fun mapModelToDTO(model: ResearchModel?): ResearchDTO {
        if(model == null) return ResearchDTO()
        return ResearchDTO(
            id = model.id,
            cro = model.cro,
            duration = model.duration,
            industry = model.industry,
            type = model.type,
            startDate = model.startDate,
            endDate = model.endDate,
            estimatedEndDate = model.estimatedEndDate,
            estimatedPatientPool = model.estimatedPatientPool,
            actualPatientPool = model.actualPatientPool,
            initiativeBy = model.initiativeBy,
            eudra_ct = model.eudra_ct,
            phase = model.phase,
            proposal = model.proposal,
            proposalId = model.proposalId,
            protocol = model.protocol,
            sampleSize = model.sampleSize,
            treatmentType = model.treatmentType,
            typology = model.typology,
            specification = model.specification,
            stateId = model.stateId,
            state = model.state,
            visits = model.visits?.map { visitsMapper.mapModelToDTO(it) }?.toList(),
            patients = model.patients?.toList(),
            stateTransitions = model.stateTransitions?.toList(),
            dossiers = model.dossiers?.toList(),
            scientificActivities = model.scientificActivities?.toList(),
            investigationTeam = model.investigationTeam?.map(invTeamMapper::mapModelToDTO)?.toList()
        )
    }
}