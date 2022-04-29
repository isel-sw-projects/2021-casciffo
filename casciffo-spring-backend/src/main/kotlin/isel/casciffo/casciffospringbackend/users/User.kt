package isel.casciffo.casciffospringbackend.users

import isel.casciffo.casciffospringbackend.roles.UserRole
import lombok.ToString
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table(value = "user_account")
@ToString
data class User(
    @Id
    var userId : Int?,

    @Column(value = "user_name")
    val name: String,

    @Column(value = "user_email")
    val email: String,

    var password: String,

    @Column(value = "user_role_id")
    var roleId: Int?,

    @Transient
    @Value("null")
    var role: UserRole?

)