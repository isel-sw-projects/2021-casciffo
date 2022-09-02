package isel.casciffo.casciffospringbackend.aggregates.visits

import isel.casciffo.casciffospringbackend.common.VisitType
import java.time.LocalDateTime

//TODO needs mapper

data class ResearchVisitsAggregate(
    //patient info
    var patientId: Int? = null,
    var processId: Long? = null,
    var fullName: String? = null,
    var gender: String? = null,
    var age: Int? = null,

    //visit
    var visitId: Int? = null,
    var researchId: Int? = null,
    var participantId: Int? = null,
    var visitType: VisitType? = null,
    var scheduledDate: LocalDateTime? = null,
    var startDate: LocalDateTime? = null,
    var endDate: LocalDateTime? = null,
    var periodicity: String? = null,
    var observations: String? = null,
    var hasAdverseEventAlert: Boolean? = null,
    var hasMarkedAttendance: Boolean? = null,

    //visit investigators
    var visitInvestigatorId: Int? = null,
    var investigatorId: Int? = null,
    var investigatorName: String? = null,
    var investigatorEmail: String? = null,
)
