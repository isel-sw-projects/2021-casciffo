package isel.casciffo.casciffospringbackend.roles

import lombok.ToString
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table


@Table(value = "user_role")
@ToString
data class UserRole (
    @Id
    var roleId : Int?,


    val roleName: String
)
