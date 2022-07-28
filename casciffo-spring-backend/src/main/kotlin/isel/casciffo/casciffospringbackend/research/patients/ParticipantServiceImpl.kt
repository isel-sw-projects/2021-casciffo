package isel.casciffo.casciffospringbackend.research.patients

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class ParticipantServiceImpl(
    @Autowired val researchParticipantsRepository: ResearchParticipantsRepository,
    @Autowired val participantRepository: ParticipantRepository
): ParticipantService {
    @Transactional
    override suspend fun addParticipantToResearch(participantId: Int, researchId: Int): Patient {
        //todo consider if in case the Id doesnt exist in casciffo db, check in admission db
        val participant = participantRepository.findById(participantId).awaitSingleOrNull()
            ?: throw IllegalArgumentException("The patient Id doesnt exist in the db!!!")

        val researchParticipant = ResearchPatients(null, participantId, researchId, LocalDateTime.now())
        researchParticipantsRepository.save(researchParticipant).awaitSingle()
        return participant
    }

    override suspend fun findAllByResearchId(researchId: Int): Flow<Patient> {
        return researchParticipantsRepository
            .findAllByResearchId(researchId)
            .flatMap { participantRepository.findById(it.patientId!!) }
            .asFlow()
    }

    override suspend fun findByProcessId(pid: Int): Patient? {
        return participantRepository.findByProcessId(pid).awaitSingle()
    }

    override suspend fun save(patient: Patient): Patient {
        return participantRepository.save(patient).awaitSingle()
    }
}