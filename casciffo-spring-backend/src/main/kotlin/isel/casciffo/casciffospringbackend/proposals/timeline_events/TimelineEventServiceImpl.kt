package isel.casciffo.casciffospringbackend.proposals.timeline_events

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

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

    override suspend fun updateEvent(proposalId: Int, eventId: Int, complete: Boolean): TimelineEventModel {
        val event = timelineEventRepository.findById(eventId).awaitSingle()
        if(complete) {
            event.completedDate = LocalDate.now()
        }
        val diff = event.completedDate!!.dayOfYear - event.deadlineDate!!.dayOfYear
        if(diff > 0) {
            event.daysOverDue = diff
            event.isOverDue = true
        }
        return timelineEventRepository.save(event).awaitSingle()
    }
}