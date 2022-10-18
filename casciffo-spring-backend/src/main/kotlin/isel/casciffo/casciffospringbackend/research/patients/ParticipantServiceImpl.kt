package isel.casciffo.casciffospringbackend.research.patients

import isel.casciffo.casciffospringbackend.aggregates.patients.ResearchPatientsAggregate
import isel.casciffo.casciffospringbackend.aggregates.patients.ResearchPatientsAggregateRepo
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

@Service
class ParticipantServiceImpl(
    @Autowired val researchParticipantsRepository: ResearchParticipantsRepository,
    @Autowired val participantRepository: ParticipantRepository,
    @Autowired val aggregateRepo: ResearchPatientsAggregateRepo
): ParticipantService {
    @Transactional
    override suspend fun addParticipantToResearch(participantId: Int, researchId: Int): PatientModel {
        //todo consider if in case the Id doesnt exist in casciffo db, check in admission db
        val participant = participantRepository.findById(participantId).awaitSingleOrNull()
            ?: throw IllegalArgumentException("The patient Id doesnt exist in the db!!!")

        val researchParticipant = ResearchPatients(null, participantId, researchId, LocalDateTime.now())
        researchParticipantsRepository.save(researchParticipant).awaitSingle()
        return participant
    }

    override suspend fun findAllByResearchId(researchId: Int): Flow<ResearchPatientsAggregate> {
        return aggregateRepo.findResearchPatientsByResearchId(researchId).asFlow()
    }

    override suspend fun findByProcessId(pid: Long): PatientModel? {
        return participantRepository.findByProcessId(pid).awaitSingle()
    }

    override suspend fun searchByProcessIdLike(pId: Long): Flow<PatientModel> {
        return participantRepository.searchPatientsByProcessId("$pId%").asFlow()
    }

    override suspend fun save(patient: PatientModel): PatientModel {
        return participantRepository.save(patient).awaitSingle()
    }

    override suspend fun getPatientDetails(researchId: Int, patientProcessNum: Long): PatientModel {
        return participantRepository.findByResearchIdAndPatientProcessNum(researchId, patientProcessNum).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST
                , "No resource found with params [researchId:$researchId,patientId:$patientProcessNum]")
    }

    override suspend fun randomizeTreatmentBranches(patients: List<ResearchPatients>): Flow<ResearchPatients> {
        return researchParticipantsRepository.saveAll(patients).asFlow()
    }
}