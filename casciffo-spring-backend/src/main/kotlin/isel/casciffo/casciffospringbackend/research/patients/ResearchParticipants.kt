package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("research_participants")
data class ResearchParticipants (
    @Id
    var id: Int?,

    var participantId: Int?,

    var researchId: Int?,

    var joinDate: LocalDateTime
)