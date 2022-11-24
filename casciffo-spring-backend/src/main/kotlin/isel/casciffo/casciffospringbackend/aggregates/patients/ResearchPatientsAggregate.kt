package isel.casciffo.casciffospringbackend.aggregates.patients

import org.springframework.data.relational.core.mapping.Column
import java.time.LocalDateTime


data class ResearchPatientsAggregate(

    var researchId: Int? = null,

    @Column("p_id")
    var patientId: Int? = null,
    var joinDate: LocalDateTime? = null,

    @Column("rp_id")
    var researchPatientId: Int? = null,

    //patient info
    var processId: Long? = null,
    var fullName: String? = null,
    var gender: String? = null,
    var age: Int? = null,

    var treatmentBranch: String? = null,
    var lastVisitDate: LocalDateTime? = null
)
