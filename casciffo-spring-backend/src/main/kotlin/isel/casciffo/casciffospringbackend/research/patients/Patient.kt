package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("participant")
data class Patient (
    @Id
    var id: Int? = null,
    var processId: Int? = null,
    var fullName: String? = null,
    var gender: String? = null,
    var age: Int? = null
)