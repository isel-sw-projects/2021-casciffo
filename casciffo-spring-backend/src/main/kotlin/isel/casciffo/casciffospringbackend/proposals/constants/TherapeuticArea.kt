package isel.casciffo.casciffospringbackend.proposals.constants


import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table


@Table(value = "therapeutic_area")
data class TherapeuticArea (
    @Id
    @Column(value = "therapeutic_area_id")
    var id: Int? = null,

    @Column(value = "therapeutic_area_name")
    val name: String? = null
)