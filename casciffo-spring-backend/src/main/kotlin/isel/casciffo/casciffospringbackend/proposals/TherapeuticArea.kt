package isel.casciffo.casciffospringbackend.proposals


import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table


@Table(value = "therapeutic_area")
class TherapeuticArea (
    @Id
    @Column(value = "therapeutic_area_id")
    var id: Int?,

    @Column(value = "therapeutic_area_name")
    val name: String
) {
    override fun toString(): String {
        return "{id:${id},\tname:${name}}"
    }
}