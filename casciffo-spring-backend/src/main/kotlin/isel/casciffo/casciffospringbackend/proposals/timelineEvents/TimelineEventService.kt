package isel.casciffo.casciffospringbackend.proposals.timelineEvents

import kotlinx.coroutines.flow.Flow

interface TimelineEventService {
    suspend fun createEvent(proposalId: Int, event: TimelineEventModel): TimelineEventModel
    suspend fun findAllByProposalId(proposalId: Int): Flow<TimelineEventModel>
}