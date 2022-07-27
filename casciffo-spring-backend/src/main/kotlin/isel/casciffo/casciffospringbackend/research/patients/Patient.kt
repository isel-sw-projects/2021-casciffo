package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("participant")
data class Participant (
    @Id
    var id: Int? = null,

    val processId: Int? = null,

    val fullName: String? = null,

    val gender: String? = null,

    val age: Int? = null
)