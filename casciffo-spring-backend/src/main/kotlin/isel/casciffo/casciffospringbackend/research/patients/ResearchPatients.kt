package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("research_participants")
data class ResearchPatients (
    @Id
    var id: Int? = null,
    @Column("participant_id")
    var patientId: Int? = null,
    var researchId: Int? = null,
    var joinDate: LocalDateTime? = null,
    var treatmentBranch: String? = null,
    var lastVisitDate: LocalDateTime? = null
)