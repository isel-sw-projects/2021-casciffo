package isel.casciffo.casciffospringbackend.proposals.constants


import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table


@Table(value = "service")
data class ServiceType (
    @Id
    @Column(value = "service_id")
    var id: Int?,

    @Column(value = "service_name")
    val name: String
)