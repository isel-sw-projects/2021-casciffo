package isel.casciffo.casciffospringbackend.proposals.constants


import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table


@Table(value = "pathology")
data class Pathology (
    @Id
    @Column(value = "pathology_id")
    var id: Int?,

    @Column(value = "pathology_name")
    val name: String
)