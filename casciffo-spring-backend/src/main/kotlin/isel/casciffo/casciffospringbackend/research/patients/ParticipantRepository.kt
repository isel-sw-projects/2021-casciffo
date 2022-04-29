package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface ParticipantRepository: ReactiveSortingRepository<Participant, Int> {
    fun findByProcessId(processId: Int) : Mono<Participant>
}