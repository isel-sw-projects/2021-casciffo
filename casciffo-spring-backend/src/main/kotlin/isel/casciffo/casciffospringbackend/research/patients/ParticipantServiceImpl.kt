package isel.casciffo.casciffospringbackend.research.patients

import isel.casciffo.casciffospringbackend.aggregates.patients.ResearchPatientsAggregate
import isel.casciffo.casciffospringbackend.aggregates.patients.ResearchPatientsAggregateRepo
import isel.casciffo.casciffospringbackend.mappers.Mapper
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataAccessResourceFailureException
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Mono
import java.time.LocalDateTime

@Service
class ParticipantServiceImpl(
    @Autowired val researchParticipantsRepository: ResearchParticipantsRepository,
    @Autowired val participantRepository: ParticipantRepository,
    @Autowired val aggregateRepo: ResearchPatientsAggregateRepo,
    @Autowired val aggregateMapper: Mapper<ResearchPatient, ResearchPatientsAggregate>
): ParticipantService {

    private val logger = KotlinLogging.logger {  }

    @Transactional(rollbackFor = [ResponseStatusException::class])
    override suspend fun addParticipantToResearch(participantId: Int, researchId: Int): ResearchPatient {
        //todo consider if in case the Id doesnt exist in casciffo db, check in admission db
        val participant = participantRepository.findById(participantId).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "O paciente não existe!")

        val alreadyExists = researchParticipantsRepository
            .findByResearchIdAndPatientId(researchId = researchId, patientId = participantId)
            .awaitSingleOrNull() != null

        if(alreadyExists) throw ResponseStatusException(HttpStatus.CONFLICT,
            "O paciente [$participantId] já está associado ao ensaio [$researchId].")


        val researchParticipant = ResearchPatient(null, participantId, researchId, LocalDateTime.now())
        return researchParticipantsRepository.save(researchParticipant).awaitSingle()
    }

    override suspend fun findAllByResearchId(researchId: Int): Flow<ResearchPatient> {
        return aggregateRepo.findResearchPatientsByResearchId(researchId).asFlow().map { aggregateMapper.mapDTOtoModel(it) }
    }

    override suspend fun findAll(): Flow<PatientModel> {
        return participantRepository.findAll().asFlow()
    }

    override suspend fun findByProcessId(pid: Long): PatientModel? {
        return participantRepository.findByProcessId(pid).awaitSingle()
    }

    override suspend fun searchByProcessIdLike(pId: Long): Flow<PatientModel> {
        return participantRepository.searchPatientsByProcessId("$pId%").asFlow()
    }

    @Transactional
    override suspend fun save(patient: PatientModel): PatientModel {
        return participantRepository.save(patient).awaitSingle()
    }

    @Transactional
    override suspend fun deletePatient(patientId: Int): PatientModel? {
        val toDelete = participantRepository.findById(patientId).awaitSingleOrNull()
        if (toDelete != null) {
            participantRepository.delete(toDelete).awaitSingleOrNull()
        }
        return toDelete
    }

    override suspend fun getPatientDetails(researchId: Int, patientProcessNum: Long): ResearchPatient {
        val patient = aggregateRepo.findByResearchIdAndProcessId(researchId, patientProcessNum).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST
                , "O paciente com nº de processo [$patientProcessNum] não foi encontrado no ensaio [$researchId]")

        return aggregateMapper.mapDTOtoModel(patient)
    }

    @Transactional
    override suspend fun updateResearchPatients(researchId: Int, patients: List<ResearchPatient>): Flow<ResearchPatient> {
        return try {
            researchParticipantsRepository.saveAll(patients).asFlow()
        } catch (ex: DataAccessResourceFailureException) {
            logger.error { ex.message }
            findAllByResearchId(researchId)
        }
    }

    @Transactional
    override suspend fun removeParticipant(researchId: Int, patientProcessNum: Int) {
        println()
        researchParticipantsRepository
            .deleteByResearchIdAndProcessNum(researchId, patientProcessNum)
            .awaitSingleOrNull()

        logger.info { "Patient with process number $patientProcessNum has been removed from research $researchId." }
    }

}