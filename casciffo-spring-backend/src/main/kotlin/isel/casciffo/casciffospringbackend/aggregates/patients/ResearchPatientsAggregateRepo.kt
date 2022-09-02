package isel.casciffo.casciffospringbackend.aggregates.patients

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ResearchPatientsAggregateRepo: ReactiveCrudRepository<ResearchPatientsAggregate, Int> {

    @Query(
        "SELECT * " +
        "FROM participant p " +
        "JOIN research_participants rp on p.id = rp.participant_id " +
        "WHERE rp.research_id = :researchId"
    )
    fun findResearchPatientsByResearchId(researchId: Int): Flux<ResearchPatientsAggregate>

    @Query(
        "SELECT * " +
        "FROM participant p " +
        "JOIN research_participants rp on p.id = rp.participant_id " +
        "WHERE rp.research_id = :researchId and p.process_id=:processId"
    )
    fun findResearchPatientDetailsByResearchIdAndProcessId(researchId: Int, processId: Long): Flux<ResearchPatientsAggregate>
}