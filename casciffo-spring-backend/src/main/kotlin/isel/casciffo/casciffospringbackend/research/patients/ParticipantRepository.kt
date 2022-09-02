package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface ParticipantRepository: ReactiveSortingRepository<PatientModel, Int> {
    fun findByProcessId(processId: Long) : Mono<PatientModel>

    @Query(
        "SELECT p.* " +
        "FROM participant p " +
        "WHERE CAST(p.process_id AS VARCHAR) LIKE :pId"
    )
    fun searchPatientsByProcessId(pId: String): Flux<PatientModel>

    @Query(
        "SELECT p.* " +
        "FROM participant p " +
        "JOIN research_participants rp on p.id = rp.participant_id " +
        "WHERE rp.research_id=:researchId AND rp.research_id=:patientId"
    )
    fun findByResearchIdAndPatientId(researchId: Int, patientId: Int): Mono<PatientModel>
}