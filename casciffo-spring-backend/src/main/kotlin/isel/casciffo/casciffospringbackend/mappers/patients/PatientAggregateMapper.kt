package isel.casciffo.casciffospringbackend.mappers.patients

import isel.casciffo.casciffospringbackend.aggregates.patients.ResearchPatientsAggregate
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.patients.PatientModel
import isel.casciffo.casciffospringbackend.research.patients.ResearchPatient
import org.springframework.stereotype.Component

@Component
class PatientAggregateMapper: Mapper<ResearchPatient, ResearchPatientsAggregate> {
    override suspend fun mapDTOtoModel(dto: ResearchPatientsAggregate?): ResearchPatient {
        return if (dto == null) ResearchPatient()
        else ResearchPatient(
            id = dto.researchPatientId,
            patientId = dto.patientId,
            researchId = dto.researchId,
            joinDate = dto.joinDate,
            treatmentBranch = dto.treatmentBranch,
            lastVisitDate = dto.lastVisitDate,
            patient = PatientModel(
                id = dto.patientId,
                processId = dto.processId,
                fullName = dto.fullName,
                gender = dto.gender,
                age = dto.age
            )
        )
    }

    override suspend fun mapModelToDTO(model: ResearchPatient?): ResearchPatientsAggregate {
        throw NotImplementedError("Left blank on purpose.")
    }
}