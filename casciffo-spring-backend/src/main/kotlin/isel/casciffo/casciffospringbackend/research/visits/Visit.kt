package isel.casciffo.casciffospringbackend.research.visits

import isel.casciffo.casciffospringbackend.research.patients.Patient
import isel.casciffo.casciffospringbackend.research.visits.investigators.VisitInvestigators
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux
import java.time.LocalDateTime

@Table("clinical_visit")
data class Visit (
    @Id
    @Column("visit_id")
    var id: Int?,

    var researchId: Int?,

    var participantId: Int?,

    val visitType: VisitType,

    val scheduledDate: LocalDateTime,

    val startDate: LocalDateTime?,

    val endDate: LocalDateTime?,

    val periodicity: String?,

    val observations: String?,

    val hasAdverseEventAlert: Boolean?,

    val hasMarkedAttendance: Boolean?,

    @Transient
    var patient: Patient?,

    @Transient
    var visitInvestigators: Flux<VisitInvestigators>?
)