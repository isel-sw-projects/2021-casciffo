package isel.casciffo.casciffospringbackend.research.visits.visits


import isel.casciffo.casciffospringbackend.common.VisitPeriodicity
import isel.casciffo.casciffospringbackend.common.VisitType
import isel.casciffo.casciffospringbackend.research.patients.ResearchPatient
import isel.casciffo.casciffospringbackend.research.visits.investigators.VisitInvestigators
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("clinical_visit")
data class VisitModel (
    @Id
    @Column("visit_id")
    var id: Int? = null,
    var researchId: Int? = null,
    var researchPatientId: Int? = null,
    var visitType: VisitType? = null,
    var scheduledDate: LocalDateTime? = null,
    var periodicity: VisitPeriodicity? = null,
    var customPeriodicity: Int? = null,
    var observations: String? = null,
    var hasAdverseEventAlert: Boolean? = null,
    var hasMarkedAttendance: Boolean? = null,
    var concluded: Boolean? = null,

    @Transient
    @Value("null")
    var researchPatient: ResearchPatient? = null,

    @Transient
    @Value("null")
    var visitInvestigators: Flow<VisitInvestigators>? = null
)
