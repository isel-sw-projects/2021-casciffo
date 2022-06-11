package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("participant")
data class Participant (
    @Id
    var id: Int?,

    val processId: Int,

    val fullName: String,

    val gender: String,

    val age: Int
)