package isel.casciffo.casciffospringbackend.proposals


import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table


@Table(value = "service")
class ServiceType (
    @Id
    @Column(value = "service_id")
    var id: Int?,

    @Column(value = "service_name")
    val name: String
) {
    override fun toString(): String {
        return "{id:${id},\tname:${name}}"
    }
}