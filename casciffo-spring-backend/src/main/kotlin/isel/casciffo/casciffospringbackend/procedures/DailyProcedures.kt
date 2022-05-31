package isel.casciffo.casciffospringbackend.procedures

import org.springframework.scheduling.annotation.Scheduled
import org.springframework.transaction.annotation.Transactional


open class DailyProcedures {
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    open suspend fun verifyAndUpdateOverDueDeadlines() {
        //TODO find all timelineevents not completed and with deadlines overdue
        // increase daysOverDue Counter
    }
}