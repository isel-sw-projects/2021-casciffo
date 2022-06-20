package isel.casciffo.casciffospringbackend.roles

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table


@Table(value = "roles")
data class Role (
    @Id
    var roleId : Int? = null,
    val roleName: String? = null
)
