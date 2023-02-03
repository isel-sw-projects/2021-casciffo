package isel.casciffo.casciffospringbackend.data_management


import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table


@Table(value = "service")
data class ServiceType (
    @Id
    @Column(value = "service_id")
    var id: Int? = null,

    @Column(value = "service_name")
    val name: String? = null
)