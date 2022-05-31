package isel.casciffo.casciffospringbackend.proposals.timeline_events

import kotlinx.coroutines.flow.Flow

interface TimelineEventService {
    suspend fun createEvent(proposalId: Int, event: TimelineEventModel): TimelineEventModel
    suspend fun findAllByProposalId(proposalId: Int): Flow<TimelineEventModel>
    suspend fun updateEvent(proposalId: Int, eventId: Int, complete: Boolean): TimelineEventModel
}