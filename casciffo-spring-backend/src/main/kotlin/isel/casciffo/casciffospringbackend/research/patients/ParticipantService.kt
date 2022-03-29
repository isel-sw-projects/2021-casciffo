package isel.casciffo.casciffospringbackend.research.patients

import isel.casciffo.casciffospringbackend.research.visits.Visit
import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Flux

interface ParticipantService {
    suspend fun getParticipantsByResearchId(researchId: Int) : Flux<Participant>
    suspend fun addParticipantToResearch(participantId: Int, researchId: Int): Participant
    suspend fun getParticipantScheduledVisits(participantId: Int, researchId: Int): Flow<Visit>
}