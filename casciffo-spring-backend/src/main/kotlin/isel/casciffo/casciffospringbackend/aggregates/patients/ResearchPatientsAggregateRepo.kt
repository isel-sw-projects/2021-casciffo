package isel.casciffo.casciffospringbackend.aggregates.patients

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface ResearchPatientsAggregateRepo: ReactiveCrudRepository<ResearchPatientsAggregate, Int> {

    @Query(
        "SELECT p.id as p_id, p.process_id, p.age, p.full_name, p.gender, " +
                "rp.id as rp_id, rp.join_date, rp.treatment_branch, rp.research_id " +
        "FROM participant p " +
        "JOIN research_participants rp on p.id = rp.participant_id " +
        "WHERE rp.research_id = :researchId"
    )
    fun findResearchPatientsByResearchId(researchId: Int): Flux<ResearchPatientsAggregate>

    @Query(
        "SELECT p.id as p_id, p.process_id, p.age, p.full_name, p.gender, " +
                "rp.id as rp_id, rp.join_date, rp.treatment_branch, rp.research_id " +
        "FROM participant p " +
        "JOIN research_participants rp on p.id = rp.participant_id " +
        "WHERE rp.research_id = :researchId and p.process_id=:processId"
    )
    fun findByResearchIdAndProcessId(researchId: Int, processId: Long): Mono<ResearchPatientsAggregate>
}