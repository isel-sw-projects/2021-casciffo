package isel.casciffo.casciffospringbackend.users.notifications

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("user_notification")
data class NotificationModel(
    @Id
    @Column("notification_id")
    var id: Int? = null,
    var userId: Int? = null,
    var title: String? = null,
    var description: String? = null,
    var viewed: Boolean? = null,
    var detailsLink: String? = null
)
