package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.common.VisitType
import isel.casciffo.casciffospringbackend.research.patients.ResearchPatient
import isel.casciffo.casciffospringbackend.research.visits.investigators.VisitInvestigators
import java.time.LocalDateTime

data class VisitDTO(
    var id: Int? = null,
    var researchId: Int? = null,
    var researchPatientId: Int? = null,
    var visitType: VisitType? = null,
    var scheduledDate: LocalDateTime? = null,
    var observations: String? = null,
    var hasAdverseEventAlert: Boolean? = null,
    var hasMarkedAttendance: Boolean? = null,
    var researchPatient: ResearchPatient? = null,
    var concluded: Boolean? = null,
    var visitInvestigators: List<VisitInvestigators>? = null,
    var periodicity: String? = null,
    var startDate: LocalDateTime? = null,
    var endDate: LocalDateTime? = null
)
