package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import org.springframework.data.annotation.Transient
import java.time.LocalDateTime

@Table("research_participants")
data class ResearchParticipants (
    @Id
    var id: Int?,

    var participantId: Int?,

    var researchId: Int?,

    @CreatedDate
    var joinDate: LocalDateTime
)