package isel.casciffo.casciffospringbackend.mappers.research

import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamDTO
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamModel
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.mappers.addenda.AddendaMapper
import isel.casciffo.casciffospringbackend.mappers.research_finance.ResesearchFinanceMapper
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.addenda.AddendaDTO
import isel.casciffo.casciffospringbackend.research.finance.clinical_trial.overview.ResearchFinance
import isel.casciffo.casciffospringbackend.research.finance.clinical_trial.overview.ResearchFinanceDTO
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
    @Autowired private val visitsMapper: Mapper<VisitModel, VisitDTO>,
    @Autowired private val addendaMapper: Mapper<Addenda, AddendaDTO>,
    @Autowired private val financeMapper: Mapper<ResearchFinance, ResearchFinanceDTO>
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
            treatmentBranches = dto.treatmentBranches,
            canceledReason = dto.canceledReason,
            canceledById = dto.canceledById,
            state = dto.state,
            stateId = dto.stateId,
            visits = dto.visits?.map { visitsMapper.mapDTOtoModel(it) }?.asFlow(),
            patients = dto.patients?.asFlow(),
            stateTransitions = dto.stateTransitions?.asFlow(),
            dossiers = dto.dossiers?.asFlow(),
            scientificActivities = dto.scientificActivities?.asFlow(),
            investigationTeam = dto.investigationTeam?.asFlow()?.map(invTeamMapper::mapDTOtoModel),
            addendas = dto.addendas?.asFlow()?.map(addendaMapper::mapDTOtoModel),
            financeComponent = if (dto.financeComponent != null) financeMapper.mapDTOtoModel(dto.financeComponent) else null
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
            treatmentBranches = model.treatmentBranches,
            canceledReason = model.canceledReason,
            canceledById = model.canceledById,
            stateId = model.stateId,
            state = model.state,
            visits = model.visits?.map { visitsMapper.mapModelToDTO(it) }?.toList(),
            patients = model.patients?.toList(),
            stateTransitions = model.stateTransitions?.toList(),
            dossiers = model.dossiers?.toList(),
            scientificActivities = model.scientificActivities?.toList(),
            investigationTeam = model.investigationTeam?.map(invTeamMapper::mapModelToDTO)?.toList(),
            addendas = model.addendas?.map(addendaMapper::mapModelToDTO)?.toList(),
            financeComponent = if (model.financeComponent != null) financeMapper.mapModelToDTO(model.financeComponent) else null
        )
    }
}
