package isel.casciffo.casciffospringbackend.aggregates.visits

import isel.casciffo.casciffospringbackend.common.VisitPeriodicity
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

    var treatmentBranch: String? = null,
    var joinDate: LocalDateTime? = null,

    //visit
    var visitId: Int? = null,
    var researchId: Int? = null,
    var researchPatientId: Int? = null,
    var visitType: VisitType? = null,
    var scheduledDate: LocalDateTime? = null,
    var startDate: LocalDateTime? = null,
    var endDate: LocalDateTime? = null,
    var periodicity: VisitPeriodicity? = null,
    var customPeriodicity: Int? = null,
    var observations: String? = null,
    var hasAdverseEventAlert: Boolean? = null,
    var hasMarkedAttendance: Boolean? = null,
    var concluded: Boolean? = null,

    //visit investigators
    var visitInvestigatorId: Int? = null,
    var investigatorId: Int? = null,
    var investigatorName: String? = null,
    var investigatorEmail: String? = null,
)
