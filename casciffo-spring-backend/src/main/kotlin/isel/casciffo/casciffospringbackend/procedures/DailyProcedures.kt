package isel.casciffo.casciffospringbackend.procedures

import isel.casciffo.casciffospringbackend.common.PT_TIMEZONE
import isel.casciffo.casciffospringbackend.proposals.ProposalService
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventRepository
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventService
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactor.asFlux
import org.slf4j.event.EventRecodingLogger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.ZoneId


open class DailyProcedures(
    @Autowired val timelineEventService: TimelineEventService,
    @Autowired val logger: EventRecodingLogger
) {
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    open fun verifyAndUpdateOverDueDeadlines() {
        timelineEventService
            .updateOverDueDeadline()
            .subscribe{
                logger.info("TimelineEvent [${it.id}]; IsOverDue:${it.isOverDue}; DaysOverDue:${it.daysOverDue}")
            }
    }
}