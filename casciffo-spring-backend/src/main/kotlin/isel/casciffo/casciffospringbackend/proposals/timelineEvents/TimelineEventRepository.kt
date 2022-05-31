package isel.casciffo.casciffospringbackend.proposals.timelineEvents

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface TimelineEventRepository : ReactiveCrudRepository<TimelineEventModel, Int> {

    @Query("select tle.* from timeline_event tle join proposal p on tle.proposal_id = p.proposal_id " +
            "where p.proposal_id=:proposalId")
    fun findTimelineEventsByProposalId(proposalId: Int) : Flux<TimelineEventModel>
}