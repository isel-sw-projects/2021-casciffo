package isel.casciffo.casciffospringbackend.aggregates.visits

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ResearchVisitsAggregateRepo: ReactiveCrudRepository<ResearchVisitsAggregate, Int> {

    @Query(
        "SELECT cv.* " +
                ", rp.treatment_branch" +
                ", p.* " +
                ", vai.id as visit_investigator_id, vai.investigator_id " +
                ", ua.user_name as investigator_name, ua.user_email as investigator_email " +
        "FROM clinical_visit cv " +
        "JOIN research_participants rp on cv.research_patient_id = rp.id " +
        "JOIN participant p on rp.participant_id = p.id " +
        "JOIN visit_assigned_investigators vai on cv.visit_id = vai.visit_id " +
        "JOIN user_account ua on ua.user_id = vai.investigator_id " +
        "WHERE cv.research_id=:researchId"
    )
    fun findVisitsByResearchId(researchId: Int): Flux<ResearchVisitsAggregate>

    @Query(
        "SELECT cv.* " +
                ", rp.treatment_branch, rp.join_date " +
                ", p.* " +
                ", vai.id as visit_investigator_id, vai.investigator_id " +
                ", ua.user_name as investigator_name, ua.user_email as investigator_email " +
        "FROM clinical_visit cv " +
        "JOIN research_participants rp on cv.research_patient_id = rp.id " +
        "JOIN participant p on rp.participant_id = p.id " +
        "JOIN visit_assigned_investigators vai on cv.visit_id = vai.visit_id " +
        "JOIN user_account ua on ua.user_id = vai.investigator_id " +
        "WHERE cv.visit_id=:visitId AND cv.research_id=:researchId"
    )
    fun findVisitDetailsByResearchAndVisitId(researchId: Int, visitId: Int): Flux<ResearchVisitsAggregate>

    @Query(
        "SELECT cv.* " +
                ", rp.treatment_branch, rp.join_date " +
                ", p.* " +
                ", vai.id as visit_investigator_id, vai.investigator_id " +
                ", ua.user_name as investigator_name, ua.user_email as investigator_email " +
        "FROM clinical_visit cv " +
        "JOIN research_participants rp on cv.research_patient_id = rp.id " +
        "JOIN participant p on rp.participant_id = p.id " +
        "JOIN visit_assigned_investigators vai on cv.visit_id = vai.visit_id " +
        "JOIN user_account ua on ua.user_id = vai.investigator_id " +
        "WHERE cv.research_id=:researchId AND p.process_id=:patientProcessId"
    )
    fun findVisitsByResearchIdAndPatientId(researchId: Int, patientProcessId: Int): Flux<ResearchVisitsAggregate>
}