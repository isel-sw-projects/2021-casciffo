package isel.casciffo.casciffospringbackend.proposals.timeline_events

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import java.time.LocalDate

@Repository
interface TimelineEventRepository : ReactiveCrudRepository<TimelineEventModel, Int> {

    @Query("select tle.* from timeline_event tle join proposal p on tle.proposal_id = p.proposal_id " +
            "where p.proposal_id=:proposalId")
    fun findTimelineEventsByProposalId(proposalId: Int) : Flux<TimelineEventModel>
    fun findAllByDeadlineDateBeforeAndCompletedDateIsNull(dateAfter: LocalDate = LocalDate.now()): Flux<TimelineEventModel>

    @Query(
        "SELECT tle.* " +
        "FROM timeline_event tle " +
        "WHERE tle.deadline_date >= :startDate AND tle.deadline_date <= :endDate " +
        "OR completed_date >= :startDate AND tle.completed_date <= :endDate"
    )
    fun findAllWithin(startDate: LocalDate, endDate: LocalDate): Flux<TimelineEventModel>
}