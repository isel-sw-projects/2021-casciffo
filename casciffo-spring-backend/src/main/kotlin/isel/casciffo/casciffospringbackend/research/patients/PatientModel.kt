package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("participant")
data class PatientModel (
    @Id
    var id: Int? = null,
    var processId: Long? = null,
    var fullName: String? = null,
    var gender: String? = null,
    var age: Int? = null
)