package isel.casciffo.casciffospringbackend.proposals.timeline_events


import isel.casciffo.casciffospringbackend.common.TimeType
import isel.casciffo.casciffospringbackend.common.dateDiffInDays
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Flux
import java.time.LocalDate
import java.time.YearMonth
import java.time.temporal.WeekFields
import java.util.*

@Service
class TimelineEventServiceImpl(
    @Autowired val timelineEventRepository: TimelineEventRepository,
) : TimelineEventService{
    override suspend fun createEvent(proposalId: Int, event: TimelineEventModel): TimelineEventModel {
        event.proposalId = proposalId
        if(event.deadlineDate == null)
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Deadline date must not be null!!!")
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
                    it.daysOverDue = dateDiffInDays(LocalDate.now(), it.deadlineDate!!)
                    it.isOverDue = it.daysOverDue!! > 0
                    it
                }
        return timelineEventRepository.saveAll(events)
    }

    override suspend fun findClosestEventsBy(t: TimeType): Flow<TimelineEventModel> {
        val startDate: LocalDate
        val endDate: LocalDate
        val today = LocalDate.now()
        when (t) {
            TimeType.DAY -> {
                startDate = today
                endDate = today
            }

            TimeType.WEEK -> {
                startDate = today.with(WeekFields.of(Locale("pt")).dayOfWeek(), 1L)
                endDate = today.with(WeekFields.of(Locale("pt")).dayOfWeek(), 7L)
            }

            TimeType.MONTH -> {
                val yearMonth = YearMonth.from(today)
                startDate = yearMonth.atDay(1)
                endDate = yearMonth.atEndOfMonth()
            }

            TimeType.YEAR -> {
                startDate = LocalDate.of(today.year, 1, 1)
                endDate = LocalDate.of(today.year, 12, 31)
            }
        }
        return timelineEventRepository.findAllWithin(startDate, endDate).asFlow()
    }
}