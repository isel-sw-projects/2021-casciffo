package isel.casciffo.casciffospringbackend.users.notifications

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Flux

@Service
class NotificationServiceImpl(
    @Autowired val repository: NotificationRepository
): NotificationService {
    override suspend fun fetchNotificationsByUserId(userId: Int): Flow<NotificationModel> {
        return repository.findAllByUserId(userId).asFlow()
    }

    override suspend fun checkNewNotifications(userId: Int): Int {
        return repository.countAllByUserIdAndViewedIsFalse(userId).awaitSingle()
    }

    override suspend fun createBulkNotifications(notifications: Flux<NotificationModel>) {
        repository.saveAll(notifications).subscribe()
    }

    override suspend fun createNotification(userId: Int, notification: NotificationModel): NotificationModel {
        notification.userId = userId
        return repository.save(notification).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "$notification Couldn't be saved.")
    }

    override suspend fun updateNotifications(
        userId: Int,
        notifications: List<NotificationModel>
    ): Flow<NotificationModel> {
        return repository.saveAll(notifications).asFlow()
    }

    override suspend fun deleteNotifications(userId: Int, notificationIds: List<Int>) {
        repository.deleteAllById(notificationIds).awaitSingleOrNull()
    }
}