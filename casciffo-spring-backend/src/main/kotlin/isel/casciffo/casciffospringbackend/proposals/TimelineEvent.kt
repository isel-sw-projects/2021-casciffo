package isel.casciffo.casciffospringbackend.proposals

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate

@Table("timeline_event")
data class TimelineEvent (
    @Id
    @Column("event_id")
    var id: Int?,

    var proposalId: Int?,

    val eventType: ProposalEventType,
    val eventName: String,
    val deadlineDate: LocalDate,
    var completedDate: LocalDate?,
    val isOverDue: Boolean,
    val daysOverDue: Int
)