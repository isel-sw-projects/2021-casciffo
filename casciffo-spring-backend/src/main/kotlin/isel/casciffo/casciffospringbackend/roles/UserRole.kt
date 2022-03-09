package isel.casciffo.casciffospringbackend.roles

import lombok.ToString
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table


@Table(value = "user_role")
@ToString
class UserRole (
    @Id
    var roleId : Int?,


    val roleName: String
) {
    override fun toString(): String {
        return "Role:{roleId=${roleId},\nroleName=${roleName}}"
    }
}
