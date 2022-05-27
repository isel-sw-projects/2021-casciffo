package isel.casciffo.casciffospringbackend.proposals.timelineEvents

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class TimelineEventServiceImpl(
    @Autowired val timelineEventRepository: TimelineEventRepository,
) : TimelineEventService{
    override suspend fun createEvent(proposalId: Int, event: TimelineEventModel): TimelineEventModel {
        event.proposalId = proposalId
        return timelineEventRepository.save(event).awaitSingle()
    }

    override suspend fun findAllByProposalId(proposalId: Int): Flow<TimelineEventModel> {
        return timelineEventRepository.findTimelineEventsByProposalId(proposalId).asFlow()
    }
}