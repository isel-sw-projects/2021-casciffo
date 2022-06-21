package isel.casciffo.casciffospringbackend.proposals.timeline_events

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import java.time.LocalDate
import java.time.LocalDateTime

@Repository
interface TimelineEventRepository : ReactiveCrudRepository<TimelineEventModel, Int> {

    @Query("select tle.* from timeline_event tle join proposal p on tle.proposal_id = p.proposal_id " +
            "where p.proposal_id=:proposalId")
    fun findTimelineEventsByProposalId(proposalId: Int) : Flux<TimelineEventModel>
    fun findAllByDeadlineDateBeforeAndCompletedDateIsNull(dateAfter: LocalDate = LocalDate.now()): Flux<TimelineEventModel>
}