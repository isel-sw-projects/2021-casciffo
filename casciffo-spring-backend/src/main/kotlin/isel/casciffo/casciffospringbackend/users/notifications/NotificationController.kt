package isel.casciffo.casciffospringbackend.users.notifications

import isel.casciffo.casciffospringbackend.endpoints.USER_NOTIFICATIONS_CHECK_URL
import isel.casciffo.casciffospringbackend.endpoints.USER_NOTIFICATIONS_URL
import isel.casciffo.casciffospringbackend.security.BearerToken
import isel.casciffo.casciffospringbackend.security.JwtSupport
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping(headers =  ["Accept=application/json"])
class NotificationController(
    @Autowired val service: NotificationService
) {

    @GetMapping(USER_NOTIFICATIONS_CHECK_URL)
    suspend fun checkNewNotifications(
        @PathVariable userId: Int
    ): ResponseEntity<Int> {
        val count = service.checkNewNotifications(userId)
        return ResponseEntity.ok(count)
    }

    @GetMapping(USER_NOTIFICATIONS_URL)
    suspend fun fetchNotifications(
        @PathVariable userId: Int,
        ctx: ServerHttpRequest
    ): Flow<NotificationModel> {
        return service.fetchNotificationsByUserId(userId)
    }

    @PostMapping(USER_NOTIFICATIONS_URL)
    suspend fun createNotification(
        @PathVariable userId: Int,
        @RequestBody notification: NotificationModel
    ): ResponseEntity<NotificationModel> {
        val createdNotification = service.createNotification(userId, notification)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNotification)
    }

    @DeleteMapping(USER_NOTIFICATIONS_URL)
    suspend fun deleteBatchNotifications(
        @PathVariable userId: Int,
        @RequestBody notificationIds: List<Int>
    ): ResponseEntity<Void> {
        service.deleteNotifications(userId, notificationIds)
        return ResponseEntity.noContent().build()
    }

    @PutMapping(USER_NOTIFICATIONS_URL)
    suspend fun updateNotification(
        @PathVariable userId: Int,
        @RequestBody notifications: List<NotificationModel>
    ): Flow<NotificationModel> {
        return service.updateNotifications(userId, notifications)
    }
}