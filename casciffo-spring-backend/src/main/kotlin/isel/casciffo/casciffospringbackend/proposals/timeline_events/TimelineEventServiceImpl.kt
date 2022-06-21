package isel.casciffo.casciffospringbackend.proposals.timeline_events


import isel.casciffo.casciffospringbackend.common.dateDiffInDays
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import java.util.Date
import java.util.concurrent.TimeUnit

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
            event.completedDate = Date()
        }
        val diff = dateDiffInDays(event.completedDate!!, event.deadlineDate!!)
        if(diff > 0) {
            event.daysOverDue = diff
            event.isOverDue = true
        }
        return timelineEventRepository.save(event).awaitSingle()
    }

    @Transactional
    override fun updateOverDueDeadlines(): Flux<TimelineEventModel> {
        val events =
            timelineEventRepository
                .findAllByDeadlineDateBeforeAndCompletedDateIsNull()
                .map {
                    it.daysOverDue = dateDiffInDays(Date(), it.deadlineDate!!)
                    it.isOverDue = it.daysOverDue!! > 0
                    it
                }
        return timelineEventRepository.saveAll(events)
    }
}