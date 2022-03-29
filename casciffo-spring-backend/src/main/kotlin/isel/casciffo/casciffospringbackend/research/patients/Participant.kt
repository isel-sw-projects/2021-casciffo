package isel.casciffo.casciffospringbackend.research.patients

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("participant")
data class Participant (
    @Id
    @Column("process_id")
    var id: Int?,

    val fullName: String,

    val gender: String,

    val age: Int
)