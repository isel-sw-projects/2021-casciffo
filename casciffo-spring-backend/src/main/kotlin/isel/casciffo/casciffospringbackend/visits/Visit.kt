package isel.casciffo.casciffospringbackend.visits

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("clinical_visit")
data class Visit (
    @Id
    @Column("visit_id")
    var id: Int?
)