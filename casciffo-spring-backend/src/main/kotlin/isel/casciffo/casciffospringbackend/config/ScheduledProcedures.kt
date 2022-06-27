package isel.casciffo.casciffospringbackend.config

import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventService
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
@Configuration
@EnableScheduling
class ScheduledProcedures(
    @Autowired val timelineEventService: TimelineEventService
) {
    private val logger = KotlinLogging.logger {  }
    @Scheduled(cron = "0 0 0 * * *")
    fun verifyAndUpdateOverDueDeadlines() {
        timelineEventService
            .updateOverDueDeadlines()
            .subscribe{
                logger.info {"TimelineEvent with [${it.id}] updated; IsOverDue:${it.isOverDue}; DaysOverDue:${it.daysOverDue}"}
            }
    }
}