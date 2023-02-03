package isel.casciffo.casciffospringbackend.data_management


import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table


@Table(value = "pathology")
data class Pathology (
    @Id
    @Column(value = "pathology_id")
    var id: Int? = null,

    @Column(value = "pathology_name")
    val name: String? = null
)