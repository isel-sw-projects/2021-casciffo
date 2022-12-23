package isel.casciffo.casciffospringbackend.research.visits.visits

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface VisitRepository: ReactiveSortingRepository<VisitModel, Int> {
    @Query("select v.* " +
            "from clinical_visit v " +
            "JOIN research_participants rp on v.research_patient_id = rp.id " +
            "where rp.participant_id =:patientId and v.research_id =:researchId")
    fun findAllByParticipantIdAndResearchId(patientId: Int, researchId: Int): Flux<VisitModel>

    @Query("select v.* from clinical_visit v where v.research_id = :researchId")
    fun findAllByResearchId(researchId: Int): Flux<VisitModel>
}