package isel.casciffo.casciffospringbackend.users.notifications

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface NotificationRepository: ReactiveSortingRepository<NotificationModel, Int> {

    @Query(
        "SELECT un.* " +
        "FROM user_notification un " +
        "WHERE un.user_id=:userId " +
        "GROUP BY un.created_date, un.notification_id, un.user_id, un.title, un.description, un.viewed, un.ids, un.notification_type " +
        "ORDER BY un.created_date DESC "
    )
    fun findAllByUserId(userId: Int): Flux<NotificationModel>


    fun countAllByUserIdAndViewedIsFalse(userId: Int): Mono<Int>
}