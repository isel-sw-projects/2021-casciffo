package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface ResearchParticipantsRepository: ReactiveSortingRepository<ResearchPatient, Int> {

    fun findAllByResearchId(researchId: Int) : Flux<ResearchPatient>

    fun findByResearchIdAndPatientId(researchId: Int, patientId: Int): Mono<ResearchPatient>

    @Query("DELETE FROM research_participants " +
            "WHERE id = " +
            "(" +
                "SELECT pr.id " +
                "FROM research_participants pr " +
                "JOIN participant p on pr.participant_id = p.id " +
                "WHERE pr.research_id=:researchId AND p.process_id=:processNum" +
            ")")
    fun deleteByResearchIdAndProcessNum(researchId: Int, processNum: Int): Mono<Unit>
}