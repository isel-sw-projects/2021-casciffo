package isel.casciffo.casciffospringbackend.mappers.clinical_visits

import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitDTO
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitModel
import kotlinx.coroutines.flow.asFlow
import kotlinx.coroutines.flow.toList
import org.springframework.stereotype.Component

@Component
class VisistMapper: Mapper<VisitModel, VisitDTO> {
    override suspend fun mapDTOtoModel(dto: VisitDTO?): VisitModel {
        return if (dto === null) VisitModel()
        else VisitModel(
            id = dto.id,
            researchId = dto.researchId,
            visitType = dto.visitType,
            researchPatientId = dto.researchPatientId,
            hasAdverseEventAlert = dto.hasAdverseEventAlert,
            hasMarkedAttendance = dto.hasMarkedAttendance,
            observations = dto.observations,
            periodicity = dto.periodicity,
            customPeriodicity = dto.customPeriodicity,
            scheduledDate = dto.scheduledDate,
            researchPatient = dto.researchPatient,
            concluded = dto.concluded,
            visitInvestigators = dto.visitInvestigators?.asFlow()
        )
    }

    override suspend fun mapModelToDTO(model: VisitModel?): VisitDTO {
        return if (model === null) VisitDTO()
        else VisitDTO(
            id = model.id,
            researchId = model.researchId,
            visitType = model.visitType,
            researchPatientId = model.researchPatientId,
            hasAdverseEventAlert = model.hasAdverseEventAlert,
            hasMarkedAttendance = model.hasMarkedAttendance,
            observations = model.observations,
            periodicity = model.periodicity,
            customPeriodicity = model.customPeriodicity,
            scheduledDate = model.scheduledDate,
            researchPatient = model.researchPatient,
            concluded = model.concluded,
            visitInvestigators = model.visitInvestigators?.toList()
        )
    }
}