package isel.casciffo.casciffospringbackend.users.notifications

import isel.casciffo.casciffospringbackend.roles.Roles
import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Flux

interface NotificationService {

    suspend fun createBulkNotifications(notifications: Flux<NotificationModel>)
    suspend fun fetchNotificationsByUserId(userId: Int): Flow<NotificationModel>
    suspend fun checkNewNotifications(userId: Int): Int
    suspend fun createNotification(userId: Int, notification: NotificationModel): NotificationModel
    suspend fun updateNotifications(userId: Int, notifications: List<NotificationModel>): Flow<NotificationModel>
    suspend fun deleteNotifications(userId: Int, notificationIds: List<Int>)
}