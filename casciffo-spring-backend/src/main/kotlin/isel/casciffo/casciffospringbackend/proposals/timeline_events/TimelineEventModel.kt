package isel.casciffo.casciffospringbackend.proposals.timeline_events

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate

@Table("timeline_event")
data class TimelineEventModel (
    @Id
    @Column("event_id")
    var id: Int? = null,

    var proposalId: Int? = null,

    var eventType: ProposalEventType? = null,
    var eventName: String? = null,
    var eventDescription: String? = null,
    var deadlineDate: LocalDate? = null,
    var completedDate: LocalDate? = null,
    var isOverDue: Boolean? = null,
    var daysOverDue: Int? = null,
    var isAssociatedToState: Boolean? = null,
    var stateName: String? = null
)