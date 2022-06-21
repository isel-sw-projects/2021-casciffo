package isel.casciffo.casciffospringbackend.procedures

import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.util.logging.Logger

@Component
@Configuration
@EnableScheduling
class DailyProcedures(
    @Autowired val timelineEventService: TimelineEventService
) {
    private val logger = Logger.getLogger(this.javaClass.simpleName)
    @Scheduled(cron = "0 0 0 * * *")
    fun verifyAndUpdateOverDueDeadlines() {
        timelineEventService
            .updateOverDueDeadlines()
            .subscribe{
                logger.info("TimelineEvent [${it.id}]; IsOverDue:${it.isOverDue}; DaysOverDue:${it.daysOverDue}")
            }
    }
}