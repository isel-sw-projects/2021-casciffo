package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.common.VisitType
import isel.casciffo.casciffospringbackend.research.patients.Patient
import isel.casciffo.casciffospringbackend.research.visits.investigators.VisitInvestigators
import java.time.LocalDateTime

data class VisitDTO(
    var id: Int? = null,
    var researchId: Int? = null,
    var participantId: Int? = null,
    val visitType: VisitType? = null,
    val scheduledDate: LocalDateTime? = null,
    val startDate: LocalDateTime? = null,
    val endDate: LocalDateTime? = null,
    val periodicity: String? = null,
    val observations: String? = null,
    val hasAdverseEventAlert: Boolean? = null,
    val hasMarkedAttendance: Boolean? = null,
    var patient: Patient? = null,
    var visitInvestigators: List<VisitInvestigators>? = null
)
