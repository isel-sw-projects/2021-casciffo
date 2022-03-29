package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository

@Repository
interface ParticipantRepository: ReactiveSortingRepository<Participant, Int> {

}