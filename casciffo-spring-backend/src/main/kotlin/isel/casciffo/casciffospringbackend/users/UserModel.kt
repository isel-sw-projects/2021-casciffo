package isel.casciffo.casciffospringbackend.users

import isel.casciffo.casciffospringbackend.roles.UserRole
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table(value = "user_account")
data class UserModel(
    @Id
    var userId : Int? = null,

    @Column(value = "user_name")
    val name: String? = null,

    @Column(value = "user_email")
    val email: String? = null,

    var password: String? = null,

    @Column(value = "user_role_id")
    var roleId: Int? = null,

    @Transient
    @Value("null")
    var role: UserRole? = null
)