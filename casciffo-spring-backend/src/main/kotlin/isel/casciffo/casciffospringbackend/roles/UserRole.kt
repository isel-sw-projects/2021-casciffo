package isel.casciffo.casciffospringbackend.roles

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table


@Table(value = "user_role")
data class UserRole (
    @Id
    var roleId : Int? = null,


    val roleName: String? = null
)
