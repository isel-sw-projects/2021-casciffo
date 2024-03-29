package isel.casciffo.casciffospringbackend.users.user

import isel.casciffo.casciffospringbackend.roles.RoleModel
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux

@Table(value = "user_account")
data class UserModel(
    @Id
    var userId : Int? = null,

    @Column(value = "user_name")
    val name: String? = null,

    @Column(value = "user_email")
    val email: String? = null,

    @Column(value = "user_password")
    var password: String? = null,

    @Transient
    @Value("null")
    var roles: Flux<RoleModel>? = null
)