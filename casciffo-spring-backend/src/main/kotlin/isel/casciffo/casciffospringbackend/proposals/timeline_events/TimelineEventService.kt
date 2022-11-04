package isel.casciffo.casciffospringbackend.proposals.timeline_events

import isel.casciffo.casciffospringbackend.common.TimeType
import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Flux

interface TimelineEventService {
    suspend fun createEvent(proposalId: Int, event: TimelineEventModel): TimelineEventModel

    suspend fun findAllByProposalId(proposalId: Int): Flow<TimelineEventModel>

    suspend fun updateEvent(proposalId: Int, eventId: Int, complete: Boolean): TimelineEventModel

    fun updateOverDueDeadlines(): Flux<TimelineEventModel>

    /**
     * Returns all events that have either been recently completed or have a nearing deadline date within a given time range.
     * Based on [t] it will show events for the current day, week, month or year.
     * @param t Type of time, represents [TimeType]
     * @return All events that have their deadline or completed date set between the given date range.
     */
    suspend fun findClosestEventsBy(t: TimeType): Flow<TimelineEventModel>
}